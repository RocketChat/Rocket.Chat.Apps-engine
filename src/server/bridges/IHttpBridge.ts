import { IHttpRequest, IHttpResponse, RequestMethod } from '../../definition/accessors';

export interface IHttpBridge {
    name: string;
    call(info: IHttpBridgeRequestInfo): Promise<IHttpResponse>;
}

export interface IHttpBridgeRequestInfo {
    appId: string;
    method: RequestMethod;
    url: string;
    request: IHttpRequest;
}
