import { AsyncTest, Expect, SetupFixture, SpyOn } from 'alsatian';
import { IMessage } from '../../../src/definition/messages';
import { IRoom } from '../../../src/definition/rooms';

import { ModifyExtender } from '../../../src/server/accessors';
import { AppBridges, IMessageBridge, IRoomBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

export class ModifyExtenderTestFixture {
    private mockAppId: string;
    private mockRoomBridge: IRoomBridge;
    private mockMessageBridge: IMessageBridge;
    private mockAppBridge: AppBridges;

    @SetupFixture
    public setupFixture() {
        this.mockAppId = 'testing-app';

        this.mockRoomBridge = {
            doGetById(roomId: string, appId: string): Promise<IRoom> {
                return Promise.resolve(TestData.getRoom());
            },
            doUpdate(room: IRoom, members: Array<string>, appId: string): Promise<void> {
                return Promise.resolve();
            },
        } as IRoomBridge;

        this.mockMessageBridge = {
            doGetById(msgId: string, appId: string): Promise<IMessage> {
                return Promise.resolve(TestData.getMessage());
            },
            doUpdate(msg: IMessage, appId: string): Promise<void> {
                return Promise.resolve();
            },
        } as IMessageBridge;

        const rmBridge = this.mockRoomBridge;
        const msgBridge = this.mockMessageBridge;
        this.mockAppBridge = {
            getMessageBridge() {
                return msgBridge;
            },
            getRoomBridge() {
                return rmBridge;
            },
        } as AppBridges;
    }

    @AsyncTest()
    public async useModifyExtender() {
        Expect(() => new ModifyExtender(this.mockAppBridge, this.mockAppId)).not.toThrow();

        const me = new ModifyExtender(this.mockAppBridge, this.mockAppId);

        SpyOn(this.mockRoomBridge, 'doGetById');
        SpyOn(this.mockRoomBridge, 'doUpdate');
        SpyOn(this.mockMessageBridge, 'doGetById');
        SpyOn(this.mockMessageBridge, 'doUpdate');

        Expect(await me.extendRoom('roomId', TestData.getUser())).toBeDefined();
        Expect(this.mockRoomBridge.doGetById).toHaveBeenCalledWith('roomId', this.mockAppId);
        Expect(await me.extendMessage('msgId', TestData.getUser())).toBeDefined();
        Expect(this.mockMessageBridge.doGetById).toHaveBeenCalledWith('msgId', this.mockAppId);

        await Expect(async () => await me.finish({} as any)).toThrowErrorAsync(Error, 'Invalid extender passed to the ModifyExtender.finish function.');
        Expect(await me.finish(await me.extendRoom('roomId', TestData.getUser()))).not.toBeDefined();
        Expect(this.mockRoomBridge.doUpdate).toHaveBeenCalled();
        Expect(await me.finish(await me.extendMessage('msgId', TestData.getUser()))).not.toBeDefined();
        Expect(this.mockMessageBridge.doUpdate).toHaveBeenCalled();
    }
}
