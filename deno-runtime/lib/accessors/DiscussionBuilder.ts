import type { IDiscussionBuilder as _IDiscussionBuilder } from "@rocket.chat/apps-engine/definition/accessors/IDiscussionBuilder.ts";
import type { IMessage } from "@rocket.chat/apps-engine/definition/messages/IMessage.ts";
import type { IRoom } from "@rocket.chat/apps-engine/definition/rooms/IRoom.ts";

import { RocketChatAssociationModel } from "@rocket.chat/apps-engine/definition/metadata/RocketChatAssociations.ts";
import { RoomType } from "@rocket.chat/apps-engine/definition/rooms/RoomType.ts";

import { RoomBuilder } from "./RoomBuilder.ts";
import { IRoomBuilder } from "@rocket.chat/apps-engine/definition/accessors/IRoomBuilder.ts";

export interface IDiscussionBuilder extends _IDiscussionBuilder, IRoomBuilder {}

export class DiscussionBuilder extends RoomBuilder implements IDiscussionBuilder {
    public kind: RocketChatAssociationModel.DISCUSSION;

    private reply?: string;

    private parentMessage?: IMessage;

    constructor(data?: Partial<IRoom>) {
        super(data);
        this.kind = RocketChatAssociationModel.DISCUSSION;
        this.room.type = RoomType.PRIVATE_GROUP;
    }

    public setParentRoom(parentRoom: IRoom): IDiscussionBuilder {
        this.room.parentRoom = parentRoom;
        return this;
    }

    public getParentRoom(): IRoom {
        return this.room.parentRoom!;
    }

    public setReply(reply: string): IDiscussionBuilder {
        this.reply = reply;
        return this;
    }

    public getReply(): string {
        return this.reply!;
    }

    public setParentMessage(parentMessage: IMessage): IDiscussionBuilder {
        this.parentMessage = parentMessage;
        return this;
    }

    public getParentMessage(): IMessage {
        return this.parentMessage!;
    }
}

