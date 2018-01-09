import { IMessage } from '@rocket.chat/apps-ts-definition/messages';

export interface IMessageBridge {
    create(message: IMessage, appId: string): string;
    getById(messageId: string, appId: string): IMessage;
    update(message: IMessage, appId: string): void;
}
