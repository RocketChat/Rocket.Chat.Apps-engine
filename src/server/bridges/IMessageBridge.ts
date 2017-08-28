import { IMessage } from 'temporary-rocketlets-ts-definition/messages';

export interface IMessageBridge {
    create(message: IMessage, rocketletId: string): string;
    getById(messageId: string, rocketletId: string): IMessage;
}
