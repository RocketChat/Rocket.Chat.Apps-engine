import type { IHttp, IHttpRequest, IHttpResponse } from '../../definition/accessors';
import { RequestMethod } from '../../definition/accessors';
import type { AppBridges } from '../bridges/AppBridges';

export class Http implements IHttp {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) {}

    public get(url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        return this.callHttp(RequestMethod.GET, url, options);
    }

    public put(url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        return this.callHttp(RequestMethod.PUT, url, options);
    }

    public post(url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        return this.callHttp(RequestMethod.POST, url, options);
    }

    public del(url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        return this.callHttp(RequestMethod.DELETE, url, options);
    }

    public patch(url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        return this.callHttp(RequestMethod.PATCH, url, options);
    }

    private callHttp(method: RequestMethod, url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        return this.bridges.getHttpBridge().doCall({
            appId: this.appId,
            method,
            url,
            request: options,
        });
    }
}
