import { IHttpResponse } from '../../../src/definition/accessors';

import { IHttpBridgeRequestInfo } from '../../../src/server/bridges';

export class TestsHttpBridge {
    public doCall(info: IHttpBridgeRequestInfo): Promise<IHttpResponse> {
        throw new Error('Method not implemented.');
    }
}
