import { mysqlTable, text, int, boolean, varchar } from 'drizzle-orm/mysql-core';


export const users = mysqlTable('user', {
	id: int().primaryKey(), // VATSIM CID
	firstName: text(),
	lastName: text(),
	email: text(),
	role: int(),
	roleOverride: int(),
	isVisitor: boolean(),
	rating: int()
});

export const userTokens = mysqlTable('userToken', {
	id: varchar({ length: 21 }).primaryKey(),
	user: int().references(() => users.id)
})