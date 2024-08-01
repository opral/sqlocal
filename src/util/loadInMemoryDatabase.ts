import { sqliteModule } from '../kysely/sqlite3InitModule.js';
import { createInMemoryDatabase } from './createInMemoryDatabase.js';

export const loadInMemoryDatabase = ({
	content,
	schema = 'main',
	readOnly = false,
}: {
	content: ArrayBuffer;
	schema: string;
	readOnly: boolean;
}) => {
	const deserializeFlag = readOnly
		? sqliteModule.capi.SQLITE_DESERIALIZE_READONLY
		: sqliteModule.capi.SQLITE_DESERIALIZE_FREEONCLOSE;

	// call create database
	const db = createInMemoryDatabase({
		readOnly,
	});

	const contentPointer = sqliteModule.wasm.allocFromTypedArray(content);
	const deserializeReturnCode = sqliteModule.capi.sqlite3_deserialize(
		db.pointer!,
		schema,
		contentPointer,
		content.byteLength, // db size
		content.byteLength, // content size
		deserializeFlag
		// Optionally:
		// | sqlite3.capi.SQLITE_DESERIALIZE_RESIZEABLE
	);

	// check if the deserialization was successfull
	db.checkRc(deserializeReturnCode);

	return db;
};
