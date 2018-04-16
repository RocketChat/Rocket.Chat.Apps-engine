import { IHttpResponse } from '@rocket.chat/apps-ts-definition/accessors';

import { IHttpBridge, IHttpBridgeRequestInfo } from '../../src/server/bridges';

export class DevHttpBridge implements IHttpBridge {
    public call(info: IHttpBridgeRequestInfo): Promise<IHttpResponse> {
        throw new Error('Method not implemented.');
    }
}
