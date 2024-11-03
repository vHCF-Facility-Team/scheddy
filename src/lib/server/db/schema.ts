import { mysqlTable, text, int, boolean, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('user', {
	id: int().primaryKey(), // VATSIM CID
	firstName: text(),
	lastName: text(),
	email: text(),
	role: int(),
	roleOverride: int(),
	isVisitor: boolean(),
	rating: int(),
	mentorAvailability: text(),
	allowedSessionTypes: text(),
	timezone: text()
});

export const userTokens = mysqlTable('userToken', {
	id: varchar({ length: 21 }).primaryKey(),
	user: int().references(() => users.id)
});

export const sessionTypes = mysqlTable('sessionType', {
	id: varchar({ length: 21 }).primaryKey(),
	name: text(),
	category: text(),
	length: int()
});

export const sessions = mysqlTable('session', {
	id: varchar({ length: 21 }).primaryKey(),
	mentor: int().references(() => users.id),
	student: int().references(() => users.id),
	type: varchar({ length: 21 }).references(() => sessionTypes.id),
	start: text(),
	end: text()
});