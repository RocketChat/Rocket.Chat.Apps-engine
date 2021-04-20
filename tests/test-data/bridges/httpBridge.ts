import { IHttpResponse } from '../../../src/definition/accessors';

import { IHttpBridge, IHttpBridgeRequestInfo } from '../../../src/server/bridges';

export class TestsHttpBridge implements IHttpBridge {
    public doCall(info: IHttpBridgeRequestInfo): Promise<IHttpResponse> {
        throw new Error('Method not implemented.');
    }
}
