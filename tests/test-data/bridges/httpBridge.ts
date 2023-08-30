import type { IHttpResponse } from '../../../src/definition/accessors';
import type { IHttpBridgeRequestInfo } from '../../../src/server/bridges';
import { HttpBridge } from '../../../src/server/bridges';

export class TestsHttpBridge extends HttpBridge {
    public call(info: IHttpBridgeRequestInfo): Promise<IHttpResponse> {
        throw new Error('Method not implemented.');
    }
}
