import { IIterator, IRoomRead } from '@rocket.chat/apps-ts-definition/accessors';
import { IMessage } from '@rocket.chat/apps-ts-definition/messages';
import { IRoom } from '@rocket.chat/apps-ts-definition/rooms';
import { IUser } from '@rocket.chat/apps-ts-definition/users';

import { IRoomBridge } from '../bridges';

export class RoomRead implements IRoomRead {
    constructor(private roomBridge: IRoomBridge, private appId: string) { }

    public getById(id: string): Promise<IRoom> {
        return this.roomBridge.getById(id, this.appId);
    }

    public getByName(name: string): Promise<IRoom> {
        return this.roomBridge.getByName(name, this.appId);
    }

    public getMessages(roomId: string): Promise<IIterator<IMessage>> {
        throw new Error('Method not implemented.');
    }

    public getMembers(roomId: string): Promise<IIterator<IUser>> {
        throw new Error('Method not implemented.');
    }
}
