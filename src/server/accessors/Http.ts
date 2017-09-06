import {
    IHttp,
    IHttpExtend,
    IHttpPreRequestHandler,
    IHttpPreResponseHandler,
    IHttpRequest,
    IHttpResponse,
    RequestMethod,
} from 'temporary-rocketlets-ts-definition/accessors';
import { RocketletBridges } from '../bridges/RocketletBridges';
import { RocketletAccessorManager } from '../managers/RocketletAccessorManager';

export class Http implements IHttp {
    constructor(private readonly accessManager: RocketletAccessorManager,
                private readonly bridges: RocketletBridges,
                private readonly httpExtender: IHttpExtend,
                private readonly rocketletId: string) { }

    public get(url: string, options?: IHttpRequest): IHttpResponse {
        return this._processHandler(url, RequestMethod.GET, options);
    }

    public put(url: string, options?: IHttpRequest): IHttpResponse {
        return this._processHandler(url, RequestMethod.PUT, options);
    }

    public post(url: string, options?: IHttpRequest): IHttpResponse {
        return this._processHandler(url, RequestMethod.POST, options);
    }

    public del(url: string, options?: IHttpRequest): IHttpResponse {
        return this._processHandler(url, RequestMethod.DELETE, options);
    }

    private _processHandler(url: string, method: RequestMethod, options?: IHttpRequest): IHttpResponse {
        let request = options || { };

        if (typeof request.headers === 'undefined') {
            request.headers = {};
        }

        this.httpExtender.getDefaultHeaders().forEach((value: string, key: string) => {
            if (typeof request.headers[key] !== 'string') {
                request.headers[key] = value;
            }
        });

        if (typeof request.params === 'undefined') {
            request.params = {};
        }

        this.httpExtender.getDefaultParams().forEach((value: string, key: string) => {
            if (typeof request.params[key] !== 'string') {
                request.params[key] = value;
            }
        });

        const reader = this.accessManager.getReader(this.rocketletId);
        const persis = this.accessManager.getPersistence(this.rocketletId);

        this.httpExtender.getPreRequestHandlers().forEach((handler: IHttpPreRequestHandler) => {
            try {
                request = handler.executePreHttpRequest(url, request, reader, persis);
            } catch (e) {
                // TODO: An error occured during in one of preRequest handlers
            }
        });

        let response = this.bridges.getHttpBridge().call({
            rocketletId: this.rocketletId,
            method,
            url,
            request,
        });

        this.httpExtender.getPreResponseHandlers().forEach((handler: IHttpPreResponseHandler) => {
            try {
                response = handler.executePreHttpResponse(response, reader, persis);
            } catch (e) {
                // TODO: An error occured during in one of preResponse handlers
            }
        });

        return response;
    }
}
