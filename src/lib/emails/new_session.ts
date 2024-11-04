import { DateTime } from 'luxon';
import { type EmailContent, templateOut } from '$lib/email';
import plaintextTemplate from './NewSession.txt?raw';
import NewSession from './NewSession.svelte';
import { render } from 'svelte/server';

export interface NewSessionProps {
	startTime: DateTime;
	type: string;
	duration: number;
	studentName: string;
	sessionId: string;
	timezone: string;
}

export function new_session(props: NewSessionProps): EmailContent {
	return {
		raw: templateOut(plaintextTemplate, {
			startTime: props.startTime.setZone(props.timezone).toLocaleString(DateTime.DATETIME_FULL),
			type: props.type,
			duration: props.duration.toString(),
			studentName: props.mentorName,
			sessionId: props.sessionId,
			timezone: props.timezone
		}),
		html: render(NewSession, {
			props: props
		}).body
	};
}
