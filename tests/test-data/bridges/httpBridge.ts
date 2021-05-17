import { IHttpResponse } from '../../../src/definition/accessors';

import { HttpBridge, IHttpBridgeRequestInfo } from '../../../src/server/bridges';

export class TestsHttpBridge extends HttpBridge {
    public call(info: IHttpBridgeRequestInfo): Promise<IHttpResponse> {
        throw new Error('Method not implemented.');
    }
}
