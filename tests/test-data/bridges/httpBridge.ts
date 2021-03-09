import { IHttpResponse } from '../../../src/definition/accessors';

import { IHttpBridge, IHttpBridgeRequestInfo } from '../../../src/server/bridges';

export class TestsHttpBridge implements IHttpBridge {
    public call(info: IHttpBridgeRequestInfo): Promise<IHttpResponse<any>> {
        throw new Error('Method not implemented.');
    }
}
