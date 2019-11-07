import { AppStatus } from '../../../src/definition/AppStatus';
import { IAppInfo } from '../../../src/definition/metadata';
import { DisabledApp } from '../../../src/server/misc/DisabledApp';

const expectedInfo: IAppInfo = {
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

test('createNewDisabledApp', async () => {
    expect(() => DisabledApp.createNew(expectedInfo, AppStatus.COMPILER_ERROR_DISABLED)).not.toThrow();
    const disabledApp = DisabledApp.createNew(expectedInfo, AppStatus.COMPILER_ERROR_DISABLED);

    expect(disabledApp).toBeDefined();
    expect(disabledApp.getLogger()).toBeDefined();
    expect(disabledApp.getInfo()).toEqual(expectedInfo);
    expect(disabledApp.getStatus()).toEqual(AppStatus.COMPILER_ERROR_DISABLED);
    expect(() => disabledApp.onEnable()).not.toThrow();
    expect(await disabledApp.onEnable()).toEqual(false);

});
