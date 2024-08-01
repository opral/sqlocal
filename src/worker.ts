import { SQLocalProcessor } from './processor.js';
import { Endpoint } from './utils/node-adapter.js';

export function makeSqlAvailable(port: Endpoint) {
	console.log('creating message processor');
	const processor = new SQLocalProcessor();

	(port as any).onmessage = () => {};

	console.log(processor);
	port.addEventListener('message', (event: any) => {
		console.log(event);
		return processor.postMessage(event.data);
	});
	processor.onmessage = (message) => {
		console.log(message);
		return port.postMessage(message);
	};
}
