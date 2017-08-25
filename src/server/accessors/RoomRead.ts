import { IIterator, IRoomRead } from 'temporary-rocketlets-ts-definition/accessors';
import { IMessage } from 'temporary-rocketlets-ts-definition/messages';
import { IRoom } from 'temporary-rocketlets-ts-definition/rooms';
import { IUser } from 'temporary-rocketlets-ts-definition/users';

import { IRoomBridge } from '../bridges';

export class RoomRead implements IRoomRead {
    constructor(private roomBridge: IRoomBridge, private rocketletId: string) { }

    public getById(id: string): IRoom {
        return this.roomBridge.getById(id, this.rocketletId);
    }

    public getByName(name: string): IRoom {
        throw new Error('Method not implemented.');
    }

    public getMessages(roomId: string): IIterator<IMessage> {
        throw new Error('Method not implemented.');
    }

    public getMembers(roomId: string): IIterator<IUser> {
        throw new Error('Method not implemented.');
    }
}
