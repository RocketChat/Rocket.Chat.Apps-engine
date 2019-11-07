import { App } from '../../../src/definition/App';
import { AppStatus } from '../../../src/definition/AppStatus';
import { IAppInfo } from '../../../src/definition/metadata';

import { AppManager } from '../../../src/server/AppManager';
import { AppFabricationFulfillment, AppInterface, ICompilerError } from '../../../src/server/compiler';
import { ProxiedApp } from '../../../src/server/ProxiedApp';
import { IAppStorageItem } from '../../../src/server/storage';

test('appFabricationDefinement', () => {
    const expctedInfo: IAppInfo = {
        id: '614055e2-3dba-41fb-be48-c1ff146f5932',
        name: 'Testing App',
        nameSlug: 'testing-app',
        description: 'A Rocket.Chat Application used to test out the various features.',
        version: '0.0.8',
        requiredApiVersion: '>=0.9.6',
        author: {
            name: 'Bradley Hilton',
            homepage: 'https://github.com/RocketChat/Rocket.Chat.Apps-ts-definitions',
            support: 'https://github.com/RocketChat/Rocket.Chat.Apps-ts-definitions/issues',
        },
        classFile: 'TestingApp.ts',
        iconFile: 'testing.jpg',
    };

    expect(() => new AppFabricationFulfillment()).not.toThrow();

    const aff = new AppFabricationFulfillment();
    expect(() => aff.setAppInfo(expctedInfo)).not.toThrow();
    expect(aff.getAppInfo()).toEqual(expctedInfo);

    const expectedInter: { [key: string]: boolean } = {};
    expectedInter[AppInterface.IPreMessageSentPrevent] = true;
    expect(() => aff.setImplementedInterfaces(expectedInter)).not.toThrow();
    expect(aff.getImplementedInferfaces()).toEqual(expectedInter);

    const expectedCompiledErrors: Array<ICompilerError> = new Array<ICompilerError>();
    expectedCompiledErrors.push({
        file: 'TestingApp.ts',
        line: 3,
        character: 54,
        message: 'Empty space',
    });
    expect(() => aff.setCompilerErrors(expectedCompiledErrors)).not.toThrow();
    expect(aff.getCompilerErrors()).toEqual(expectedCompiledErrors);

    const fakeApp = new ProxiedApp({} as AppManager, { status: AppStatus.UNKNOWN } as IAppStorageItem, {} as App, (mod: string) => mod);
    expect(() => aff.setApp(fakeApp)).not.toThrow();
    expect(aff.getApp()).toEqual(fakeApp);
});
