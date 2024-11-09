import type { PageServerLoad, Actions } from './$types';
import { loadUserData } from '$lib/userInfo';
import { ROLE_DEVELOPER, ROLE_MENTOR, ROLE_STAFF, roleString } from '$lib/utils';
import { roleOf } from '$lib';
import { db } from '$lib/server/db';
import { sessions, sessionTypes, users } from '$lib/server/db/schema';
import { eq, gt, or } from 'drizzle-orm';
import type { DayAvailability, MentorAvailability } from '$lib/availability';
import { DateTime, Duration, Interval } from 'luxon';
import { fail } from '@sveltejs/kit';
import { MAX_BOOKING_AHEAD_DAYS } from '$env/static/private';
import { nanoid } from 'nanoid';
import { appointment_booked } from '$lib/emails/appointment_booked';
import { sendEmail } from '$lib/email';
import { new_session } from '$lib/emails/new_session';

function slottificate(
	sTypes: typeof sessionTypes.$inferSelect,
	mentors: typeof users.$inferSelect,
	allSessions: typeof sessions.$inferSelect
): Record<string, { slot: Interval; mentor: number }[]> {
	const slotData: Record<string, { slot: Interval; mentor: number }[]> = {};

	const now = DateTime.utc();
	const tomorrow = now.plus({ days: 1 });
	const validDaysToBook: DateTime[] = [];
	for (let i = 0; i < Number.parseInt(MAX_BOOKING_AHEAD_DAYS); i++) {
		validDaysToBook.push(now.plus({ days: i }));
	}

	const sessionsByMentor = {};
	for (const sess of allSessions) {
		if (!sessionsByMentor[sess.mentor]) {
			sessionsByMentor[sess.mentor] = [];
		}
		sessionsByMentor[sess.mentor].push(sess);
	}

	for (const typ of sTypes) {
		const slots = [];
		for (const mentor of mentors) {
			const allowedTypes = JSON.parse(mentor.allowedSessionTypes);
			if (!allowedTypes) continue;
			if (!allowedTypes.includes(typ.id)) continue;

			const availability: MentorAvailability | null = JSON.parse(mentor.mentorAvailability);
			if (!availability) continue;

			const mentorsOtherSessions = sessionsByMentor[mentor.id] || [];

			const availablePeriodsMentorsTime: Interval[] = [];
			const unavailablePeriodsMentorsTime: Interval[] = [];

			// create a list of blocked off periods
			for (const otherSess of mentorsOtherSessions) {
				const start = DateTime.fromISO(otherSess.start);
				const end = DateTime.fromISO(otherSess.end);

				unavailablePeriodsMentorsTime.push(Interval.fromDateTimes(start, end));
			}

			// figure out their availability for each day
			for (const validDay of validDaysToBook) {
				const dayInMentorsTz = validDay.setZone(mentor.timezone);
				let todaysAvail: DayAvailability | null = null;
				// do they have a date exception set?

				const exceptionDateKey = dayInMentorsTz.toFormat('yyyy-MM-dd');
				if (Object.keys(availability.exceptions).includes(exceptionDateKey)) {
					todaysAvail = availability.exceptions[exceptionDateKey];
				} else {
					// no exception, use weekday availability
					if (dayInMentorsTz.weekday == 1) todaysAvail = availability.monday;
					else if (dayInMentorsTz.weekday == 2) todaysAvail = availability.tuesday;
					else if (dayInMentorsTz.weekday == 3) todaysAvail = availability.wednesday;
					else if (dayInMentorsTz.weekday == 4) todaysAvail = availability.thursday;
					else if (dayInMentorsTz.weekday == 5) todaysAvail = availability.friday;
					else if (dayInMentorsTz.weekday == 6) todaysAvail = availability.saturday;
					else if (dayInMentorsTz.weekday == 7) todaysAvail = availability.sunday;
				}

				// convert the availability back to a UTC interval
				if (todaysAvail && todaysAvail.available) {
					// we are available
					const start = dayInMentorsTz.set({
						hour: todaysAvail.start.hour,
						minute: todaysAvail.start.minute,
						second: 0,
						millisecond: 0
					});
					console.log(start, todaysAvail);
					const end = dayInMentorsTz.set({
						hour: todaysAvail.end.hour,
						minute: todaysAvail.end.minute,
						second: 0,
						millisecond: 0
					});
					console.log(end, todaysAvail);

					const interval = Interval.fromDateTimes(start, end);

					console.log(interval);
					if (interval.start == null) {
						console.log("-- INVALID INTERVAL --");
						console.log(start);
						console.log(end);
					}

					availablePeriodsMentorsTime.push(interval);
				}
			}

			// ok, we have a list of available and unavailable periods, but they're still in the mentor's timezone
			// so we need to convert it back into UTC
			// timezones suck :/
			const availablePeriods = [];
			const unavailablePeriods = [];

			for (const period of availablePeriodsMentorsTime) {
				if (!period.start || !period.end) {
					console.log(period);
					return;
				}
				availablePeriods.push(
					Interval.fromDateTimes(period.start.setZone('utc'), period.end.setZone('utc'))
				);
			}
			for (const period of unavailablePeriodsMentorsTime) {
				if (!period.start || !period.end) {
					console.log(period);
					return;
				}
				unavailablePeriods.push(
					Interval.fromDateTimes(period.start.setZone('utc'), period.end.setZone('utc'))
				);
			}

			// calculate difference of each availablePeriod to get a list of o.k. slots
			const thisMentorAvailability: Interval[] = [];

			for (const period of availablePeriods) {
				thisMentorAvailability.push(...period.difference(...unavailablePeriods));
			}

			// split each available period into individual session slots
			const individualSlots: Interval[] = [];

			const minimumLength = typ.length!;

			for (const period of thisMentorAvailability) {
				individualSlots.push(...period.splitBy(Duration.fromObject({ minutes: minimumLength })));
			}

			// finally, drop any that are too short or <24h

			const validSlots: Interval[] = [];

			for (const potentialSlot of individualSlots) {
				if (potentialSlot.length('minutes') >= minimumLength && potentialSlot.start >= tomorrow) {
					validSlots.push(potentialSlot);
				}
			}

			slots.push(
				...validSlots.map((u) => {
					return {
						slot: u.toISO(),
						mentor: mentor.id
					};
				})
			);
		}
		slotData[typ.id] = slots;
	}

	return slotData;
}

export const load: PageServerLoad = async ({ cookies }) => {
	const { user } = (await loadUserData(cookies))!;

	const sTypes = await db.select().from(sessionTypes);
	const mentors = await db
		.select()
		.from(users)
		.where(or(gt(users.role, ROLE_MENTOR), gt(users.roleOverride, ROLE_MENTOR)));

	const allSessions = await db.select().from(sessions);

	const slotData = slottificate(sTypes, mentors, allSessions);

	return {
		user,
		role: roleString(roleOf(user)),
		isTrainer: roleOf(user) >= ROLE_MENTOR,
		isStaff: roleOf(user) >= ROLE_STAFF,
		isDeveloper: roleOf(user) >= ROLE_DEVELOPER,
		sessionTypes: sTypes,
		slotData
	};
};

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const { user } = (await loadUserData(cookies))!;

		const formData = await request.formData();
		const requestedSlotId = formData.get('timeslot')!;
		const requestedType = formData.get('type')!;
		const timezone = formData.get('timezone')!;

		const sTypes = await db.select().from(sessionTypes);
		const mentors = await db
			.select()
			.from(users)
			.where(or(gt(users.role, ROLE_MENTOR), gt(users.roleOverride, ROLE_MENTOR)));
		const allSessions = await db.select().from(sessions);

		const slotData = slottificate(sTypes, mentors, allSessions);

		if (!slotData[requestedType]) {
			return fail(400);
		}

		const slotObj = {
			slot: requestedSlotId.split('@')[0],
			mentor: Number.parseInt(requestedSlotId.split('@')[1])
		};
		const availableSlots = slotData[requestedType];

		let slotStillAvailable = false;
		for (const availSlot of availableSlots) {
			if (availSlot.slot === slotObj.slot && availSlot.mentor == slotObj.mentor) {
				slotStillAvailable = true;
			}
		}

		if (!slotStillAvailable) {
			return fail(400);
		}

		const interval = Interval.fromISO(slotObj.slot);
		const start = interval.start.setZone('utc');

		const mentor = (await db.select().from(users).where(eq(users.id, slotObj.mentor)))[0]!;

		let duration = 0;
		let typename = '';
		for (const typ of sTypes) {
			if (typ.id === requestedType) {
				duration = typ.length;
				typename = typ.name;
			}
		}

		const id = nanoid();

		const studentEmailContent = appointment_booked({
			startTime: start.setZone(timezone.toString()),
			timezone: timezone.toString(),
			mentorName: mentor.firstName + ' ' + mentor.lastName,
			duration,
			sessionId: id,
			type: typename
		});
		const mentorEmailContent = new_session({
			startTime: start.setZone(timezone.toString()),
			timezone: timezone.toString(),
			studentName: user.firstName + ' ' + user.lastName,
			duration,
			sessionId: id,
			type: typename
		});

		await db.insert(sessions).values({
			id,
			mentor: slotObj.mentor,
			student: user.id,
			start: start.toISO(),
			type: requestedType
		});

		await sendEmail(
			user.email,
			'Appointment booked',
			studentEmailContent.raw,
			studentEmailContent.html
		);
		await sendEmail(
			mentor.email,
			'New session booked',
			mentorEmailContent.raw,
			mentorEmailContent.html
		);
	}
};
