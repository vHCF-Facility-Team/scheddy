import { type Cookies, redirect } from '@sveltejs/kit';
import { users, userTokens } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export interface UserData {
	user: typeof users.$inferSelect;
	userToken: typeof userTokens.$inferSelect;
}

function condFail(a: boolean): null {
	if (a) return null;
	redirect(307, '/');
}

export async function loadUserData(
	cookies: Cookies,
	allowLoggedOut = false
): Promise<UserData | null> {
	const token = cookies.get('scheddy_token');
	if (!token) {
		console.log('condFail !token');
		return condFail(allowLoggedOut);
	}

	const returnedUsers = await db
		.select()
		.from(userTokens)
		.leftJoin(users, eq(userTokens.user, users.id))
		.where(eq(userTokens.id, token));

	if (returnedUsers.length == 0) {
		console.log('condFail missing user');
		return condFail(allowLoggedOut);
	}

	const userAndToken = returnedUsers[0];

	if (!userAndToken) {
		console.log('condFail user null');
		return condFail(allowLoggedOut);
	}
	if (!userAndToken.user) {
		console.log('confFail userpair missing user');
		return condFail(allowLoggedOut);
	}

	return {
		user: userAndToken.user,
		userToken: userAndToken.userToken
	};
}
