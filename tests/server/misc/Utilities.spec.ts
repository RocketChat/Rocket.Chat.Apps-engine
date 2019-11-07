import { Utilities } from '../../../src/server/misc/Utilities';

const expectedInfo = {
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

test('testDeepClone', () => {
    expect(() => Utilities.deepClone(expectedInfo)).not.toThrow();
    const info = Utilities.deepClone(expectedInfo);

    expect(info).toEqual(expectedInfo);
    info.name = 'New Testing App';
    expect(info.name).toEqual('New Testing App');
    expect(info.author.name).toEqual(expectedInfo.author.name);
});

test('testDeepFreeze', () => {
    expect(() => expectedInfo.name = 'New Testing App').not.toThrow();
    expect(() => expectedInfo.author.name = 'Bradley H').not.toThrow();
    expect(expectedInfo.name).toEqual('New Testing App');
    expect(expectedInfo.author.name).toEqual('Bradley H');

    expect(() => Utilities.deepFreeze(expectedInfo)).not.toThrow();

    expect(() => expectedInfo.name = 'Old Testing App').toThrow();
    expect(() => expectedInfo.author.name = 'Bradley').toThrow();
    expect(expectedInfo.name).toEqual('New Testing App');
    expect(expectedInfo.author.name).toEqual('Bradley H');
});

test('testDeepCloneAndFreeze', () => {
    expect(() => Utilities.deepCloneAndFreeze({})).not.toThrow();

    const info = Utilities.deepCloneAndFreeze(expectedInfo);
    expect(info).toEqual(expectedInfo);
    expect(info).not.toBe(expectedInfo);
    expect(info.author.name).toEqual(expectedInfo.author.name);
    expect(info.author.name).toEqual('Bradley H'); // was changed on testDeepFreeze
    expect(() => info.author.name = 'Bradley Hilton').toThrow();
});
