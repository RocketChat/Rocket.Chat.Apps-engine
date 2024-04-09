import { 
    IHttp, 
    IHttpExtend, 
    IHttpRequest, 
    IHttpResponse, 
    RequestMethod 
} from "@rocket.chat/apps-engine/definition/accessors/IHttp.ts";
import { IPersistence } from "@rocket.chat/apps-engine/definition/accessors/IPersistence.ts";
import { IRead } from "@rocket.chat/apps-engine/definition/accessors/IRead.ts";
import * as Messenger from '../messenger.ts';

export class Http implements IHttp {
    private httpExtender: IHttpExtend;
    private read: IRead;
    private persistence: IPersistence;
    private senderFn: typeof Messenger.sendRequest;

    constructor(read: IRead, persistence: IPersistence, httpExtender: IHttpExtend, senderFn: typeof Messenger.sendRequest) {
        this.read = read;
        this.persistence = persistence;
        this.httpExtender = httpExtender;
        this.senderFn = senderFn;
        // this.httpExtender = new HttpExtend();
    }

    public get(url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        console.error('Http.GET')
        return this._processHandler(url, RequestMethod.GET, options);
    }

    public put(url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        return this._processHandler(url, RequestMethod.PUT, options);
    }

    public post(url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        return this._processHandler(url, RequestMethod.POST, options);
    }

    public del(url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        return this._processHandler(url, RequestMethod.DELETE, options);
    }

    public patch(url: string, options?: IHttpRequest): Promise<IHttpResponse> {
        return this._processHandler(url, RequestMethod.PATCH, options);
    }

    private async _processHandler(url: string, method: RequestMethod, options?: IHttpRequest): Promise<IHttpResponse> {
        console.error('Http._processHandler')
        let request = options || {};

        if (typeof request.headers === 'undefined') {
            request.headers = {};
        }

        this.httpExtender.getDefaultHeaders().forEach((value: string, key: string) => {
            if (typeof request.headers?.[key] !== 'string') {
                request.headers![key] = value;
            }
        });

        if (typeof request.params === 'undefined') {
            request.params = {};
        }

        this.httpExtender.getDefaultParams().forEach((value: string, key: string) => {
            if (typeof request.params?.[key] !== 'string') {
                request.params![key] = value;
            }
        });

        for (const handler of this.httpExtender.getPreRequestHandlers()) {
            request = await handler.executePreHttpRequest(url, request, this.read, this.persistence);
        }

        let { result: response } = await this.senderFn({
            method: `accessor:getHttp:${method}`,
            params: [url, request],

        })
        for (const handler of this.httpExtender.getPreResponseHandlers()) {
            response = await handler.executePreHttpResponse(response as IHttpResponse, this.read, this.persistence);
        }

        return response as IHttpResponse;
    }
}
