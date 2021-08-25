import { NetBridge } from '../../../src/server/bridges/NetBridge';

export class TestsNetBridge extends NetBridge {
    public createConnection(options: object): NodeJS.Socket {
        throw new Error('Method not implemented.');
    }
}
