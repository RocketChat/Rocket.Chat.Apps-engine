import {
    IHttpExtend,
    IHttpPreRequestHandler,
    IHttpPreResponseHandler,
} from '../../definition/accessors';

export class HttpExtend implements IHttpExtend {
    private headers: Map<string, string>;
    private params: Map<string, string>;
    private requests: Array<IHttpPreRequestHandler<any, any>>;
    private responses: Array<IHttpPreResponseHandler<any, any>>;

    constructor() {
        this.headers = new Map<string, string>();
        this.params = new Map<string, string>();
        this.requests = new Array<IHttpPreRequestHandler<any, any>>();
        this.responses = new Array<IHttpPreResponseHandler<any, any>>();
    }

    public provideDefaultHeader(key: string, value: string): void {
        this.headers.set(key, value);
    }

    public provideDefaultHeaders(headers: { [key: string]: string; }): void {
        Object.keys(headers).forEach((key) => this.headers.set(key, headers[key]));
    }

    public provideDefaultParam(key: string, value: string): void {
        this.params.set(key, value);
    }

    public provideDefaultParams(params: { [key: string]: string; }): void {
        Object.keys(params).forEach((key) => this.params.set(key, params[key]));
    }

    public providePreRequestHandler<TBody, TResult>(handler: IHttpPreRequestHandler<TBody, TResult>): void {
        this.requests.push(handler);
    }

    public providePreResponseHandler<TResult1, TResult2>(handler: IHttpPreResponseHandler<TResult1, TResult2>): void {
        this.responses.push(handler);
    }

    public getDefaultHeaders(): Map<string, string> {
        return new Map<string, string>(this.headers);
    }

    public getDefaultParams(): Map<string, string> {
        return new Map<string, string>(this.params);
    }

    public getPreRequestHandlers(): Array<IHttpPreRequestHandler<any, any>> {
        return Array.from(this.requests);
    }

    public getPreResponseHandlers(): Array<IHttpPreResponseHandler<any, any>> {
        return Array.from(this.responses);
    }
}
