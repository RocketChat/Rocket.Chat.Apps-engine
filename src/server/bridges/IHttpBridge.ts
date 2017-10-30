import { IHttpRequest, IHttpResponse, RequestMethod } from 'temporary-rocketlets-ts-definition/accessors';

export interface IHttpBridge {
    call(info: IHttpBridgeRequestInfo): IHttpResponse;
}

export interface IHttpBridgeRequestInfo {
    rocketletId: string;
    method: RequestMethod;
    url: string;
    request: IHttpRequest;
}
