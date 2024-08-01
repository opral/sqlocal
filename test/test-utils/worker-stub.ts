import { Endpoint } from "../../src/utils/node-adapter.js";

class WorkerStub implements Endpoint {
    postMessage(message: any, transfer?: Transferable[] | undefined): void {
        throw new Error("Method not implemented.");
    }
    start?: (() => void) | undefined;
    addEventListener(type: string, listener: any, options?: {} | undefined): void {
        throw new Error("Method not implemented.");
    }
    removeEventListener(type: string, listener: any, options?: {} | undefined): void {
        throw new Error("Method not implemented.");
    }

}