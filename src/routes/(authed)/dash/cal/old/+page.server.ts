import { loadUserData } from '$lib/userInfo';
import { roleOf } from '$lib';
import { ROLE_MENTOR, ROLE_STAFF } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { mentors, sessions, sessionTypes, students } from '$lib/server/db/schema';
import { eq, and, lte } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { DateTime } from 'luxon';

export const load: PageServerLoad = async ({ cookies }) => {
	const { user } = (await loadUserData(cookies))!;
	if (roleOf(user) < ROLE_MENTOR) {
		redirect(307, '/schedule');
	}

	const validTypes = await db.select().from(sessionTypes);

	const typesMap: Record<string, string> = {};
	for (const typ of validTypes) {
		typesMap[typ.id] = typ.name;
	}

	const now = DateTime.utc().toISO();
	const query = db
		.select()
		.from(sessions)
		.leftJoin(students, eq(students.id, sessions.student))
		.leftJoin(mentors, eq(mentors.id, sessions.mentor))
		.leftJoin(sessionTypes, eq(sessionTypes.id, sessions.type));

	if (roleOf(user) < ROLE_STAFF) {
		query.where(
			and(eq(mentors.id, user.id), eq(sessions.cancelled, false), lte(sessions.start, now))
		);
	} else {
		query.where(and(lte(sessions.start, now), eq(sessions.cancelled, false)));
	}

	const mentorSessions = await query;

	mentorSessions.sort((a, b) => {
		const a_dt = DateTime.fromISO(a.session.start);
		const b_dt = DateTime.fromISO(b.session.start);
		if (a_dt < b_dt) {
			return 1;
		} else if (a_dt > b_dt) {
			return -1;
		} else {
			return 0;
		}
	});

	return {
		user,
		mentorSessions,
		typesMap,
		breadcrumbs: [
			{ title: 'Dashboard', url: '/dash' },
			{ title: 'Facility Calendar', url: '/dash/cal' },
			{ title: 'Past Sessions' }
		]
	};
};
