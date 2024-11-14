<script lang="ts">
	import type { AppointmentBookedProps } from '$lib/emails/appointment_booked';
	import { DateTime } from 'luxon';

	let { startTime, sessionId, type, timezone, mentorName }: AppointmentBookedProps = $props();
</script>

<h1>Appointment reminder</h1>

<p>
	This email is to remind you of your upcoming {type} session at {startTime
		.setZone(timezone)
		.toLocaleString(DateTime.DATETIME_HUGE)} ({timezone}).
</p>
<p>
	As it is now within 24 hours, directly contact {mentorName}, your mentor, to make any changes.
</p>

<p>---</p>

<i>Confirmation ID {sessionId}</i>
<i
	>You are receiving this email because you have booked a session with the ZTL ARTCC. If you believe
	to have received this email in error, please contact wm@ztlartcc.org.</i
>
