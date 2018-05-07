import { IMessage } from '@rocket.chat/apps-ts-definition/messages';
import { IRoom } from '@rocket.chat/apps-ts-definition/rooms';
import { AsyncTest, Expect, SetupFixture, SpyOn } from 'alsatian';

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
            getById(roomId: string, appId: string): Promise<IRoom> {
                return Promise.resolve(TestData.getRoom());
            },
            update(room: IRoom, appId: string): Promise<void> {
                return Promise.resolve();
            },
        } as IRoomBridge;

        this.mockMessageBridge = {
            getById(msgId: string, appId: string): Promise<IMessage> {
                return Promise.resolve(TestData.getMessage());
            },
            update(msg: IMessage, appId: string): Promise<void> {
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

        SpyOn(this.mockRoomBridge, 'getById');
        SpyOn(this.mockRoomBridge, 'update');
        SpyOn(this.mockMessageBridge, 'getById');
        SpyOn(this.mockMessageBridge, 'update');

        Expect(await me.extendRoom('roomId', TestData.getUser())).toBeDefined();
        Expect(this.mockRoomBridge.getById).toHaveBeenCalledWith('roomId', this.mockAppId);
        Expect(await me.extendMessage('msgId', TestData.getUser())).toBeDefined();
        Expect(this.mockMessageBridge.getById).toHaveBeenCalledWith('msgId', this.mockAppId);

        await Expect(async () => await me.finish({} as any)).toThrowErrorAsync(Error, 'Invalid extender passed to the ModifyExtender.finish function.');
        Expect(await me.finish(await me.extendRoom('roomId', TestData.getUser()))).not.toBeDefined();
        Expect(this.mockRoomBridge.update).toHaveBeenCalled();
        Expect(await me.finish(await me.extendMessage('msgId', TestData.getUser()))).not.toBeDefined();
        Expect(this.mockMessageBridge.update).toHaveBeenCalled();
    }
}
