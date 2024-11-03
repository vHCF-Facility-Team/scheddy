import { z } from "zod";

export const typeSchema = z.object({
	allowed: z.record(z.string(), z.boolean())
});