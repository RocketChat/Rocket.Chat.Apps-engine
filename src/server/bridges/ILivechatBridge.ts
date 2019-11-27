import { IDepartment, ILivechatMessage, ILivechatRoom, ILivechatTransferData, IVisitor } from '../../definition/livechat';
import { IUser } from '../../definition/users';

export interface ILivechatBridge {
    isOnline(): boolean;
    createMessage(message: ILivechatMessage, appId: string): Promise<string>;
    getMessageById(messageId: string, appId: string): Promise<ILivechatMessage>;
    updateMessage(message: ILivechatMessage, appId: string): Promise<void>;
    createVisitor(visitor: IVisitor, appId: string): Promise<string>;
    findVisitors(query: object, appId: string): Promise<Array<IVisitor>>;
    transferVisitor(visitor: IVisitor, transferData: ILivechatTransferData, appId: string): Promise<boolean>;
    createRoom(visitor: IVisitor, agent: IUser, appId: string): Promise<ILivechatRoom>;
    closeRoom(room: ILivechatRoom, comment: string, appId: string): Promise<boolean>;
    findRooms(visitor: IVisitor, departmentId: string | null, appId: string): Promise<Array<ILivechatRoom>>;
    findDepartments(query: object, appId: string): Promise<Array<IDepartment>>;
}
