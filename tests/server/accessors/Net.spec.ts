import { Expect, SetupFixture, SpyOn, Test } from 'alsatian';

import { Net } from '../../../src/server/accessors';
import { AppBridges, NetBridge } from '../../../src/server/bridges';

export class NetAccessorsTestFixture {
    private mockAppBridge: AppBridges;
    private mockAppId: string;
    private mockNetBridge: NetBridge;
    private mockSocket: NodeJS.Socket;

    @SetupFixture
    public setupFixture() {
        this.mockAppId = 'testing-app';

        const socket = this.mockSocket as NodeJS.Socket;
        this.mockNetBridge = {
            doCreateConnection(options: {}, appId: string): NodeJS.Socket {
                return socket;
            },
        } as NetBridge;

        const netBridge = this.mockNetBridge;
        this.mockAppBridge = {
            getNetBridge(): NetBridge {
                return netBridge;
            },
        } as AppBridges;
    }

    @Test()
    public useNet() {
        Expect(() => new Net(this.mockAppBridge, this.mockAppId)).not.toThrow();

        const net = new Net(this.mockAppBridge, this.mockAppId);
        SpyOn(this.mockNetBridge, 'doCreateConnection');
        SpyOn(net, 'createConnection');
    }
}
