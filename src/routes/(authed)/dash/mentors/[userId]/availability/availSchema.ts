import { z } from 'zod';

export const time = z.object({
	hour: z.coerce.number(),
	minute: z.coerce.number()
});

export const dayAvailability = z.object({
	available: z.coerce.boolean(),
	start: time,
	end: time
});

export const availSchema = z.object({
	timezone: z.string(),
	sunday: dayAvailability,
	monday: dayAvailability,
	tuesday: dayAvailability,
	wednesday: dayAvailability,
	thursday: dayAvailability,
	friday: dayAvailability,
	saturday: dayAvailability,
	exceptions: z.record(z.string(), dayAvailability)
});
