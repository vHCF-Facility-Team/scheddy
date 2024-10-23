import type { LayoutServerLoad } from "./$types";
import { loadUserData } from '$lib/userInfo';
import { users } from '$lib/server/db/schema';
import { roleOf } from '$lib';
import { redirect } from '@sveltejs/kit';
import { ne } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { ROLE_STAFF } from '$lib/utils';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const { user } = (await loadUserData(cookies))!;
	if (roleOf(user) < ROLE_STAFF) {
		redirect(307, "/schedule");
	}

	return {
		user,
		users: await db.select()
			.from(users)
			.where(ne(users.roleOverride, 0))
	}
}