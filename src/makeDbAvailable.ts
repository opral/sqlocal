import { SQLocalProcessor } from './processor.js';
import { Endpoint } from './utils/node-adapter.js';

export function makeDbAvailable(port: Endpoint) {
	const processor = new SQLocalProcessor();

	// XXX check why addEventListener has no effect if i don't override
	(port as any).onmessage = () => {};

	port.addEventListener('message', (event: any) => {
		return processor.postMessage(event.data);
	});

	processor.onmessage = (message) => {
		return port.postMessage(message);
	};
}
