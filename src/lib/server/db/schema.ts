import { mysqlTable, text, int, boolean, varchar } from 'drizzle-orm/mysql-core';
import { aliasedTable } from 'drizzle-orm';

export const users = mysqlTable('user', {
	id: int().primaryKey().notNull(), // VATSIM CID
	firstName: text().notNull(),
	lastName: text().notNull(),
	email: text().notNull(),
	role: int().notNull(),
	roleOverride: int().notNull(),
	isVisitor: boolean().notNull(),
	rating: int().notNull(),
	mentorAvailability: text(),
	allowedSessionTypes: text(),
	bookableSessionTypes: text(),
	timezone: text()
});

export const userTokens = mysqlTable('userToken', {
	id: varchar({ length: 21 }).primaryKey().notNull(),
	user: int()
		.references(() => users.id)
		.notNull()
});

export const sessionTypes = mysqlTable('sessionType', {
	id: varchar({ length: 21 }).primaryKey().notNull(),
	name: text().notNull(),
	category: text().notNull(),
	length: int().notNull(),
	order: int().notNull().default(0),
	rating: int().notNull().default(2),
	bookable: boolean().notNull().default(true)
});

export const sessions = mysqlTable('session', {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	mentor: int()
		.references(() => users.id)
		.notNull(),
	student: int()
		.references(() => users.id)
		.notNull(),
	type: varchar({ length: 21 })
		.references(() => sessionTypes.id)
		.notNull(),
	start: text().notNull(),
	reminded: boolean().default(false).notNull(),
	timezone: text().notNull(),
	createdBy: int().references(() => users.id),
	createdAt: text(),
	cancelled: boolean().notNull().default(false),
	cancellationUserLevel: int(),
	cancellationReason: text()
});

export const pendingTransfers = mysqlTable('transfers', {
	oldMentor: int()
		.references(() => users.id)
		.notNull(),
	newMentor: int()
		.references(() => users.id)
		.notNull(),
	sessionId: varchar({ length: 26 }).primaryKey().notNull()
});

export const students = aliasedTable(users, 'student');
export const mentors = aliasedTable(users, 'mentor');
