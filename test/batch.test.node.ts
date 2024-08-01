import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SQLocal, makeDbAvailable } from '../src/index';
import nodeEndpoint from '../src/utils/node-adapter';


const { port1, port2 } = new MessageChannel();
port1.onmessage = () => {};
port2.onmessage = () => {};

makeDbAvailable(port2);

const { sql, batch } = new SQLocal({ storage: { type: 'memory' } }, port1);
// const worker = new Worker(new URL('../src/worker', import.meta.url));
// let endpoint = nodeEndpoint(worker);

describe('batch', () => {
	console.log('batch worker:');
	console.log(port1);
	console.log('init database');
	const { sql, batch } = new SQLocal({ storage: { type: 'memory' } }, port1);

	beforeEach(async () => {
		await sql`CREATE TABLE groceries (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)`;
	});

	afterEach(async () => {
		await sql`DROP TABLE groceries`;
	});

	it('should perform successful batch query', async () => {
		const txData = await batch((sql) => [
			sql`INSERT INTO groceries (name) VALUES ('apples') RETURNING *`,
			sql`INSERT INTO groceries (name) VALUES ('bananas')`,
		]);

		expect(txData).toEqual([[{ id: 1, name: 'apples' }], []]);

		const selectData = await sql`SELECT * FROM groceries`;
		expect(selectData.length).toBe(2);
	});

	it('should rollback failed batch query', async () => {
		const txData = await batch((sql) => [
			sql`INSERT INTO groceries (name) VALUES ('carrots') RETURNING *`,
			sql`INSERT INT groceries (name) VALUES ('lettuce') RETURNING *`,
		]).catch(() => [[], []]);

		expect(txData).toEqual([[], []]);

		const selectData = await sql`SELECT * FROM groceries`;
		expect(selectData.length).toBe(0);
	});
});
