import type { users } from '$lib/server/db/schema';

export function roleOf(user: typeof users.$inferSelect): number {
	return Math.max(user.role, user.roleOverride);
}
