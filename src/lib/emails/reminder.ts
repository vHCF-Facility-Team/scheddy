import { DateTime } from 'luxon';
import { type EmailContent, templateOut } from '$lib/email';
import plaintextTemplate from './Reminder.txt?raw';
import Reminder from './Reminder.svelte';
import { render } from 'svelte/server';

export interface ReminderProps {
	startTime: DateTime;
	type: string;
	sessionId: string;
	timezone: string;
	mentorName: string;
}

export function reminder(props: ReminderProps): EmailContent {
	return {
		raw: templateOut(plaintextTemplate, {
			startTime: props.startTime.setZone(props.timezone).toLocaleString(DateTime.DATETIME_HUGE),
			type: props.type,
			sessionId: props.sessionId,
			timezone: props.timezone,
			mentorName: props.mentorName
		}),
		html: render(Reminder, {
			props: props
		}).body
	};
}
