<script lang="ts">
	import type { AppointmentBookedProps } from '$lib/emails/appointment_booked';

	let { startTime, duration, mentorName, sessionId, type, timezone }: AppointmentBookedProps =
		$props();
</script>

<h1>Appointment booked!</h1>

<p>This is your confirmation email for your upcoming session.</p>
<p><b>Session type:</b> {type}</p>
<p><b>Date/time:</b> {startTime}</p>
<p><b>Timezone:</b> {timezone}</p>
<p><b>Duration:</b> {duration} minutes</p>
<p><b>Mentor:</b> {mentorName}</p>
<i>Please reach out to your mentor directly if you need to cancel or reschedule this lesson.</i>

<p>---</p>

<i>Confirmation ID {sessionId}</i>
<i
	>You are receiving this email because you have booked a session with the ZTL ARTCC. If you believe
	to have received this email in error, please contact wm@ztlartcc.org.</i
>
