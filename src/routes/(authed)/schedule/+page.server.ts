import type { PageServerLoad } from './$types';
import { loadUserData } from '$lib/userInfo';
import { ROLE_DEVELOPER, ROLE_MENTOR, ROLE_STAFF, roleString } from '$lib/utils';
import { roleOf } from '$lib';
import { db } from '$lib/server/db';
import { sessionTypes } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ cookies }) => {
	const { user } = (await loadUserData(cookies))!;

	return {
		user,
		role: roleString(roleOf(user)),
		isTrainer: roleOf(user) >= ROLE_MENTOR,
		isStaff: roleOf(user) >= ROLE_STAFF,
		isDeveloper: roleOf(user) >= ROLE_DEVELOPER,
		sessionTypes: await db.select()
													.from(sessionTypes)
	};
};
