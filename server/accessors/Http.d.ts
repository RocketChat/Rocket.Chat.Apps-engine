import { IHttp, IHttpExtend, IHttpRequest, IHttpResponse } from '../../definition/accessors';
import { AppBridges } from '../bridges/AppBridges';
import { AppAccessorManager } from '../managers/AppAccessorManager';
export declare class Http implements IHttp {
    private readonly accessManager;
    private readonly bridges;
    private readonly httpExtender;
    private readonly appId;
    constructor(accessManager: AppAccessorManager, bridges: AppBridges, httpExtender: IHttpExtend, appId: string);
    get(url: string, options?: IHttpRequest): Promise<IHttpResponse>;
    put(url: string, options?: IHttpRequest): Promise<IHttpResponse>;
    post(url: string, options?: IHttpRequest): Promise<IHttpResponse>;
    del(url: string, options?: IHttpRequest): Promise<IHttpResponse>;
    private _processHandler(url, method, options?);
}
