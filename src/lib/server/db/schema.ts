import { mysqlTable, text, int, boolean } from 'drizzle-orm/mysql-core';

export const ROLE_SITE_ADMIN = 40;
export const ROLE_FACILITY_STAFF = 30;
export const ROLE_MENTOR = 20;
export const ROLE_STUDENT = 10;
export const ROLE_NON_MEMBER = 0;

export const user = mysqlTable('user', {
	id: int('id'), // VATSIM CID
	firstName: text('firstName'),
	lastName: text('lastName'),

	role: int('role'),

	isVisitor: boolean('isVisitor')
});