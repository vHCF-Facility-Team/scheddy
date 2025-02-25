import type { PageServerLoad, Actions } from './$types';
import { loadUserData } from '$lib/userInfo';
import { users } from '$lib/server/db/schema';
import { roleOf } from '$lib';
import { redirect } from '@sveltejs/kit';
import { eq, ne } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { ROLE_STAFF } from '$lib/utils';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createSchema } from './createSchema';

export const load: PageServerLoad = async ({ cookies }) => {
	const { user } = (await loadUserData(cookies))!;
	if (roleOf(user) < ROLE_STAFF) {
		redirect(307, '/schedule');
	}

	return {
		user,
		users: await db.select().from(users).where(ne(users.roleOverride, 0)),
		createForm: await superValidate(zod(createSchema)),
		breadcrumbs: [{ title: 'Dashboard', url: '/dash' }, { title: 'User Management' }]
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, zod(createSchema));

		const { user } = (await loadUserData(event.cookies))!;
		if (roleOf(user) < ROLE_STAFF) {
			return fail(403, { createForm: form });
		}
		if (!form.valid) {
			return fail(400, { createForm: form });
		}

		const u = await db.select().from(users).where(eq(users.id, form.data.cid));
		if (u.length === 0) {
			setError(
				form,
				'cid',
				'User does not exist. They must log in at least once before you can use this feature.'
			);
			return fail(400, { createForm: form });
		}

		await db
			.update(users)
			.set({ roleOverride: form.data.roleOverride })
			.where(eq(users.id, form.data.cid));

		return { createForm: form };
	},
	remove: async (event) => {
		const { user } = (await loadUserData(event.cookies))!;
		if (roleOf(user) < ROLE_STAFF) {
			return fail(403);
		}

		const uid = Number.parseInt((await event.request.formData()).get('id')!.toString());

		await db.update(users).set({ roleOverride: 0 }).where(eq(users.id, uid));
	}
};
