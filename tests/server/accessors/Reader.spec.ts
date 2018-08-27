import { Expect, SetupFixture, Test } from 'alsatian';
import { IEnvironmentRead, IMessageRead, INotifier, IPersistenceRead, IRoomRead, IUserRead } from '../../../src/definition/accessors';

import { Reader } from '../../../src/server/accessors';

export class ReaderAccessorTestFixture {
    private env: IEnvironmentRead;
    private msg: IMessageRead;
    private pr: IPersistenceRead;
    private rm: IRoomRead;
    private ur: IUserRead;
    private ni: INotifier;

    @SetupFixture
    public setupFixture() {
        this.env = {} as IEnvironmentRead;
        this.msg = {} as IMessageRead;
        this.pr = {} as IPersistenceRead;
        this.rm = {} as IRoomRead;
        this.ur = {} as IUserRead;
        this.ni = {} as INotifier;
    }

    @Test()
    public useReader() {
        Expect(() => new Reader(this.env, this.msg, this.pr, this.rm, this.ur, this.ni)).not.toThrow();

        const rd = new Reader(this.env, this.msg, this.pr, this.rm, this.ur, this.ni);
        Expect(rd.getEnvironmentReader()).toBeDefined();
        Expect(rd.getMessageReader()).toBeDefined();
        Expect(rd.getNotifier()).toBeDefined();
        Expect(rd.getPersistenceReader()).toBeDefined();
        Expect(rd.getRoomReader()).toBeDefined();
        Expect(rd.getUserReader()).toBeDefined();
    }
}
