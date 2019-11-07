
import { IApi } from '../../../src/definition/api';
import { IApiEndpoint } from '../../../src/definition/api/IApiEndpoint';
import { AppApi } from '../../../src/server/managers/AppApi';
import { ProxiedApp } from '../../../src/server/ProxiedApp';

let mockApp: ProxiedApp;

beforeAll(() =>  {
    mockApp = {
        getID() {
            return 'id';
        },
    } as ProxiedApp;
});

test('ensureAppApi', () => {
    expect(() => new AppApi(mockApp, {} as IApi, {} as IApiEndpoint)).not.toThrow();

    const ascr = new AppApi(mockApp, {} as IApi, {} as IApiEndpoint);
    expect(ascr.app).toBeDefined();
    expect(ascr.api).toBeDefined();
});
