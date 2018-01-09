import { IMessageExtender } from '@rocket.chat/apps-ts-definition/accessors';
import { IMessage, IMessageAttachment } from '@rocket.chat/apps-ts-definition/messages';
import { RocketChatAssociationModel } from '@rocket.chat/apps-ts-definition/metadata';

export class MessageExtender implements IMessageExtender {
    public readonly kind: RocketChatAssociationModel.MESSAGE;

    constructor(private msg: IMessage) {
        this.kind = RocketChatAssociationModel.MESSAGE;

        if (!Array.isArray(msg.attachments)) {
            this.msg.attachments = new Array<IMessageAttachment>();
        }
    }

    public addCustomField(key: string, value: any): IMessageExtender {
        if (this.msg.customFields[key]) {
            throw new Error(`The message already contains a custom field by the key: ${ key }`);
        }

        this.msg.customFields[key] = value;

        return this;
    }

    public addAttachment(attachment: IMessageAttachment): IMessageExtender {
        this.msg.attachments.push(attachment);

        return this;
    }

    public addAttachments(attachments: Array<IMessageAttachment>): IMessageExtender {
        this.msg.attachments = this.msg.attachments.concat(attachments);

        return this;
    }

    public getMessage(): IMessage {
        return Object.create(this.msg);
    }
}
