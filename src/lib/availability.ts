export interface MentorAvailability {
	sunday: DayAvailability;
	monday: DayAvailability;
	tuesday: DayAvailability;
	wednesday: DayAvailability;
	thursday: DayAvailability;
	friday: DayAvailability;
	saturday: DayAvailability;
	exceptions: Record<string, DayAvailability>;
}
export interface DayAvailability {
	available: boolean;
	start: Time;
	end: Time;
}
export interface Time {
	hour: number;
	minute: number;
}

function hhmmsss_to_timenum(h: number, m: number, s: number): number {
	return s + m * 60 + h * 60 * 60;
}
function timenum_to_hhmmss(seconds: number): [number, number, number] {
	const hours = Math.floor(seconds / 3600);
	const s2 = seconds % 3600;
	const minutes = Math.floor(s2 / 60);
	const s3 = s2 % 60;
	return [hours, minutes, s3];
}
