import { IHttpRequest, IHttpResponse, RequestMethod } from '@rocket.chat/apps-ts-definition/accessors';

export interface IHttpBridge {
    call(info: IHttpBridgeRequestInfo): IHttpResponse;
}

export interface IHttpBridgeRequestInfo {
    appId: string;
    method: RequestMethod;
    url: string;
    request: IHttpRequest;
}
