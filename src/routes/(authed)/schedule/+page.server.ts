import type { PageServerLoad } from "./$types";
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { users, userTokens } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get("scheddy_token");
	if (!token) {
		redirect(307, "/");
	}

	const returnedUsers = await db.select().from(userTokens)
		.leftJoin(users, eq(userTokens.user, users.id))
		.where(eq(userTokens.id, token));

	if (returnedUsers.length == 0) {
		redirect(307, "/");
	}

	const userAndToken = returnedUsers[0];

	if (!userAndToken) {
		redirect(307, "/");
	}
	if (!userAndToken.user) {
		redirect(307, "/");
	}

	return {
		user: userAndToken.user
	}
}