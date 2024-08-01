import sqlite3InitModule, { Database } from '@sqlite.org/sqlite-wasm';

export const sqliteModule = await sqlite3InitModule();
