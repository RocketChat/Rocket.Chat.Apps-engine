import { IMessage } from 'temporary-rocketlets-ts-definition/messages';

export interface IMessageBridge {
    getById(messageId: string, rocketletId: string): IMessage;
}
