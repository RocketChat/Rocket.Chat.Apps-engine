import { IMessage } from '../messages/IMessage';
import { IVisitor } from './IVisitor';

export interface ILivechatMessage extends IMessage {
    visitor?: IVisitor;
    token?: string;
}
