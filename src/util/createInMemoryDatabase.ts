import { sqliteModule } from '../kysely/sqlite3InitModule.js';
import sqlite3InitModule, { Database } from '@sqlite.org/sqlite-wasm';
export const createInMemoryDatabase = ({
	readOnly = false,
}: {
	readOnly?: boolean;
}) => {
	const flags = [
		readOnly ? 'r' : 'cw', // read and write
		'', // non verbose
	].join('');

	return new sqliteModule.oo1.DB(':memory:', flags);
};
