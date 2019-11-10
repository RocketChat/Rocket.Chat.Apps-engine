import { ILivechatCreator } from '../../../src/definition/accessors';
import { ILivechatRoom, IVisitor } from '../../../src/definition/livechat';
import { IUser } from '../../../src/definition/users';
import { LivechatCreator } from '../../../src/server/accessors/LivechatCreator';
import { AppBridges, ILivechatBridge } from '../../../src/server/bridges';

const mockAppId: string = 'testing-app';
const mockVisitor: IVisitor = {} as IVisitor;
let mockAppBridges: AppBridges;
let mockLivechatBridge: ILivechatBridge;
let livechatCreator: ILivechatCreator;

beforeAll(() => {
    mockLivechatBridge = {
        createRoom(visitor: IVisitor, agent: IUser, appId: string): Promise<ILivechatRoom> {
            return Promise.resolve({} as ILivechatRoom);
        },
        createVisitor(visitor: IVisitor, appId: string): Promise<string> {
            return Promise.resolve('visitor');
        },
    } as ILivechatBridge;

    mockAppBridges = {
        getLivechatBridge() {
            return mockLivechatBridge;
        },
    } as AppBridges;
});

beforeEach(() => {
    livechatCreator = new LivechatCreator(mockAppBridges, mockAppId);
});

afterEach(() => {
    livechatCreator = null;
});

test('createRoom', () => {
    const createRoomSpy = jest.spyOn(mockLivechatBridge, 'createRoom');
    const agent = {} as IUser;

    expect(() => livechatCreator.createRoom(mockVisitor, agent)).not.toThrow();
    expect(createRoomSpy).toHaveBeenCalledWith(mockVisitor, agent, mockAppId);
    expect(createRoomSpy).toHaveBeenCalledTimes(1);
});

test('createVisitor', () => {
    const createVisitorSpy = jest.spyOn(mockLivechatBridge, 'createVisitor');

    expect(() => livechatCreator.createVisitor(mockVisitor)).not.toThrow();
    expect(createVisitorSpy).toHaveBeenCalledWith(mockVisitor, mockAppId);
    expect(createVisitorSpy).toHaveBeenCalledTimes(1);
});

test('createToken', () => {
    expect(() => livechatCreator.createToken()).not.toThrow();
    expect(livechatCreator.createToken().length).toBeGreaterThan(20);
});
