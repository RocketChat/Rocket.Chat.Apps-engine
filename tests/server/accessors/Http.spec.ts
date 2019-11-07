import { IHttpExtend, IHttpPreRequestHandler, IHttpPreResponseHandler, IHttpRequest, IHttpResponse, IPersistence, IRead } from '../../../src/definition/accessors';

import { Http, HttpExtend } from '../../../src/server/accessors';
import { AppBridges, IHttpBridge, IHttpBridgeRequestInfo } from '../../../src/server/bridges';
import { AppAccessorManager } from '../../../src/server/managers';

let mockAppId: string;
let mockHttpBridge: IHttpBridge;
let mockAppBridge: AppBridges;
let mockHttpExtender: IHttpExtend;
let mockReader: IRead;
let mockPersis: IPersistence;
let mockAccessorManager: AppAccessorManager;
let mockPreRequestHandler: IHttpPreRequestHandler;
let mockPreResponseHandler: IHttpPreResponseHandler;
let mockResponse: IHttpResponse;

beforeAll(() =>  {
    mockAppId = 'testing-app';

    mockResponse = { statusCode: 200 } as IHttpResponse;
    const res = mockResponse;
    mockHttpBridge = {
        call(info: IHttpBridgeRequestInfo): Promise<IHttpResponse> {
            return Promise.resolve(res);
        },
    } as IHttpBridge;

    const httpBridge = mockHttpBridge;
    mockAppBridge = {
        getHttpBridge(): IHttpBridge {
            return httpBridge;
        },
    } as AppBridges;

    mockHttpExtender = new HttpExtend();

    mockReader = {} as IRead;
    mockPersis = {} as IPersistence;
    const reader = mockReader;
    const persis = mockPersis;
    mockAccessorManager = {
        getReader(appId: string): IRead {
            return reader;
        },
        getPersistence(appId: string): IPersistence {
            return persis;
        },
    } as AppAccessorManager;

    mockPreRequestHandler = {
        executePreHttpRequest(url: string, request: IHttpRequest, read: IRead, persistence: IPersistence): Promise<IHttpRequest> {
            return Promise.resolve(request);
        },
    } as IHttpPreRequestHandler;

    mockPreResponseHandler = {
        executePreHttpResponse(response: IHttpResponse, read: IRead, persistence: IPersistence): Promise<IHttpResponse> {
            return Promise.resolve(response);
        },
    } as IHttpPreResponseHandler;
});

test('useHttp', async () => {
    expect(() => new Http(mockAccessorManager, mockAppBridge, mockHttpExtender, mockAppId)).not.toThrow();

    const http = new Http(mockAccessorManager, mockAppBridge, mockHttpExtender, mockAppId);

    jest.spyOn(mockHttpBridge, 'call');
    jest.spyOn(mockPreRequestHandler, 'executePreHttpRequest');
    jest.spyOn(mockPreResponseHandler, 'executePreHttpResponse');

    expect(await http.get('url-here')).toBeDefined();
    expect(await http.post('url-here')).toBeDefined();
    expect(await http.put('url-here')).toBeDefined();
    expect(await http.del('url-here')).toBeDefined();
    expect(await http.get('url-here', { headers: {}, params: {} })).toBeDefined();

    const request1 = {} as IHttpRequest;
    mockHttpExtender.provideDefaultHeader('Auth-Token', 'Bearer asdfasdf');
    expect(await http.post('url-here', request1)).toBeDefined();
    expect(request1.headers['Auth-Token']).toBe('Bearer asdfasdf');
    request1.headers['Auth-Token'] = 'mine';
    expect(await http.put('url-here', request1)).toBeDefined(); // Check it the default doesn't override provided
    expect(request1.headers['Auth-Token']).toBe('mine');

    const request2 = {} as IHttpRequest;
    mockHttpExtender.provideDefaultParam('count', '20');
    expect(await http.del('url-here', request2)).toBeDefined();
    expect(request2.params.count).toBe('20');
    request2.params.count = '50';
    expect(await http.get('url-here', request2)).toBeDefined(); // Check it the default doesn't override provided
    expect(request2.params.count).toBe('50');

    mockHttpExtender.providePreRequestHandler(mockPreRequestHandler);
    const request3 = {} as IHttpRequest;
    expect(await http.post('url-here', request3)).toBeDefined();
    expect(mockPreRequestHandler.executePreHttpRequest).toHaveBeenCalledWith('url-here', request3, mockReader, mockPersis);
    (mockHttpExtender as any).requests = [];

    mockHttpExtender.providePreResponseHandler(mockPreResponseHandler);
    expect(await http.post('url-here')).toBeDefined();
    expect(mockPreResponseHandler.executePreHttpResponse).toHaveBeenCalledWith(mockResponse, mockReader, mockPersis);

    expect(mockHttpBridge.call).toBeCalledTimes(11);
});
