import { IEnvironmentRead, ILivechatRead, IMessageRead, INotifier, IPersistenceRead, IRoomRead, IUploadRead, IUserRead } from '../../../src/definition/accessors';

import { Reader } from '../../../src/server/accessors';

let env: IEnvironmentRead;
let msg: IMessageRead;
let pr: IPersistenceRead;
let rm: IRoomRead;
let ur: IUserRead;
let ni: INotifier;
let livechat: ILivechatRead;
let upload: IUploadRead;

beforeAll(() =>  {
    env = {} as IEnvironmentRead;
    msg = {} as IMessageRead;
    pr = {} as IPersistenceRead;
    rm = {} as IRoomRead;
    ur = {} as IUserRead;
    ni = {} as INotifier;
    livechat = {} as ILivechatRead;
    upload = {} as IUploadRead;
});

test('useReader', () => {
    expect(() => new Reader(env, msg, pr, rm, ur, ni, livechat, upload)).not.toThrow();

    const rd = new Reader(env, msg, pr, rm, ur, ni, livechat, upload);
    expect(rd.getEnvironmentReader()).toBeDefined();
    expect(rd.getMessageReader()).toBeDefined();
    expect(rd.getNotifier()).toBeDefined();
    expect(rd.getPersistenceReader()).toBeDefined();
    expect(rd.getRoomReader()).toBeDefined();
    expect(rd.getUserReader()).toBeDefined();
    expect(rd.getLivechatReader()).toBeDefined();
    expect(rd.getUploadReader()).toBeDefined();
});
