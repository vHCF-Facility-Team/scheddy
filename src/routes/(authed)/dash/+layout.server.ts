import type { LayoutServerLoad } from './$types';
import { loadUserData } from '$lib/userInfo';
import { roleOf } from '$lib';
import { redirect } from '@sveltejs/kit';
import { ROLE_STAFF, roleString } from '$lib/utils';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const { user } = (await loadUserData(cookies))!;
	if (roleOf(user) < ROLE_STAFF) {
		redirect(307, '/schedule');
	}

	return {
		user,
		role: roleString(roleOf(user))
	};
};
