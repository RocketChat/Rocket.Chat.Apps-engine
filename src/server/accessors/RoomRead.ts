import { IRoomRead } from '../../definition/accessors';
import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';

import { IRoomBridge } from '../bridges';

export class RoomRead implements IRoomRead {
    constructor(private roomBridge: IRoomBridge, private appId: string) { }

    public getById(id: string): Promise<IRoom> {
        return this.roomBridge.getById(id, this.appId);
    }

    public getCreatorUserById(id: string): Promise<IUser> {
        return this.roomBridge.getCreatorById(id, this.appId);
    }

    public getByName(name: string): Promise<IRoom> {
        return this.roomBridge.getByName(name, this.appId);
    }

    public getCreatorUserByName(name: string): Promise<IUser> {
        return this.roomBridge.getCreatorByName(name, this.appId);
    }

    public getMessages(roomId: string): Promise<IterableIterator<IMessage>> {
        throw new Error('Method not implemented.');
    }

    public getMembers(roomId: string): Promise<IterableIterator<IUser>> {
        throw new Error('Method not implemented.');
    }
}
