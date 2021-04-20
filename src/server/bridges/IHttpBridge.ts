import { IHttpRequest, IHttpResponse, RequestMethod } from '../../definition/accessors';

export interface IHttpBridge {
    doCall(info: IHttpBridgeRequestInfo): Promise<IHttpResponse>;
}

export interface IHttpBridgeRequestInfo {
    appId: string;
    method: RequestMethod;
    url: string;
    request: IHttpRequest;
}
