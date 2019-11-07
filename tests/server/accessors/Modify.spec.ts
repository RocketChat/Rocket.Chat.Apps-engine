import { Modify } from '../../../src/server/accessors';
import { AppBridges, IMessageBridge } from '../../../src/server/bridges';

let mockAppBridges: AppBridges;

beforeAll(() =>  {
    mockAppBridges = {
        getMessageBridge(): IMessageBridge {
            return {} as IMessageBridge;
        },
    } as AppBridges;
});

test('useModify', () => {
    expect(() => new Modify(mockAppBridges, 'testing')).not.toThrow();

    const md = new Modify(mockAppBridges, 'testing');
    expect(md.getCreator()).toBeDefined();
    expect(md.getExtender()).toBeDefined();
    expect(md.getNotifier()).toBeDefined();
    expect(md.getUpdater()).toBeDefined();
});
