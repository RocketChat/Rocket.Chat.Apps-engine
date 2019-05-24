import { ILivechatMessage } from '../../definition/livechat/ILivechatMessage';
import { ILivechatRoom } from '../../definition/livechat/ILivechatRoom';
import { IVisitor } from '../../definition/livechat/IVisitor';
import { IUser } from '../../definition/users';

export interface ILivechatBridge {
    createMessage(message: ILivechatMessage, appId: string): Promise<string>;
    getMessageById(messageId: string, appId: string): Promise<ILivechatMessage>;
    updateMessage(message: ILivechatMessage, appId: string): Promise<void>;
    createVisitor(visitor: IVisitor, appId: string): Promise<string>;
    findVisitors(query: object, appId: string): Promise<Array<IVisitor>>;
    createRoom(visitor: IVisitor, agent: IUser, appId: string): Promise<ILivechatRoom>;

    findRooms(visitor: IVisitor, departmentId: string | null, appId: string): Promise<Array<ILivechatRoom>>;
}
