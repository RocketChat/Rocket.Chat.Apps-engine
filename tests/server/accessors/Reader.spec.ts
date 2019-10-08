import { Expect, SetupFixture, Test } from 'alsatian';
import { IEnvironmentRead, ILivechatRead, IMessageRead, INotifier, IPersistenceRead, IRoomRead, IUploadRead, IUserRead } from '../../../src/definition/accessors';

import { Reader } from '../../../src/server/accessors';

export class ReaderAccessorTestFixture {
    private env: IEnvironmentRead;
    private msg: IMessageRead;
    private pr: IPersistenceRead;
    private rm: IRoomRead;
    private ur: IUserRead;
    private ni: INotifier;
    private livechat: ILivechatRead;
    private upload: IUploadRead;

    @SetupFixture
    public setupFixture() {
        this.env = {} as IEnvironmentRead;
        this.msg = {} as IMessageRead;
        this.pr = {} as IPersistenceRead;
        this.rm = {} as IRoomRead;
        this.ur = {} as IUserRead;
        this.ni = {} as INotifier;
        this.livechat = {} as ILivechatRead;
        this.upload = {} as IUploadRead;
    }

    @Test()
    public useReader() {
        Expect(() => new Reader(this.env, this.msg, this.pr, this.rm, this.ur, this.ni, this.livechat, this.upload)).not.toThrow();

        const rd = new Reader(this.env, this.msg, this.pr, this.rm, this.ur, this.ni, this.livechat, this.upload);
        Expect(rd.getEnvironmentReader()).toBeDefined();
        Expect(rd.getMessageReader()).toBeDefined();
        Expect(rd.getNotifier()).toBeDefined();
        Expect(rd.getPersistenceReader()).toBeDefined();
        Expect(rd.getRoomReader()).toBeDefined();
        Expect(rd.getUserReader()).toBeDefined();
        Expect(rd.getLivechatReader()).toBeDefined();
        Expect(rd.getUploadReader()).toBeDefined();
    }
}
