import { z } from 'zod';

export const createSchema = z.object({
	cid: z.number(),
	roleOverride: z.number()
});
export type CreateSchema = typeof createSchema;
