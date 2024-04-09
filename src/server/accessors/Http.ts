import type { IHttp, IHttpRequest, IHttpResponse } from '../../definition/accessors';
import { RequestMethod } from '../../definition/accessors';
import type { AppBridges } from '../bridges/AppBridges';

export class Http implements IHttp {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) {}

    public get(url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        return this.callHttp(url, RequestMethod.GET, options);
    }

    public put(url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        return this.callHttp(url, RequestMethod.PUT, options);
    }

    public post(url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        return this.callHttp(url, RequestMethod.POST, options);
    }

    public del(url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        return this.callHttp(url, RequestMethod.DELETE, options);
    }

    public patch(url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        return this.callHttp(url, RequestMethod.PATCH, options);
    }

    private callHttp(url: string, method: RequestMethod, options?: IHttpRequest): Promise<IHttpResponse> {
        return this.bridges.getHttpBridge().doCall({
            appId: this.appId,
            method,
            url,
            request: options,
        });
    }
}
