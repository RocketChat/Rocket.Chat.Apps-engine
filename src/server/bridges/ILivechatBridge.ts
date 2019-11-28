import { IDepartment, ILivechatMessage, ILivechatRoom, ILivechatTransferData, IVisitor } from '../../definition/livechat';
import { IUser } from '../../definition/users';

export interface ILivechatBridge {
    isOnline(): boolean;
    createMessage(message: ILivechatMessage, appId: string): Promise<string>;
    getMessageById(messageId: string, appId: string): Promise<ILivechatMessage>;
    updateMessage(message: ILivechatMessage, appId: string): Promise<void>;
    createVisitor(visitor: IVisitor, appId: string): Promise<string>;
    /**
     * @deprecated This method does not adhere to the conversion practices applied
     * elsewhere in the Apps-Engine and will be removed in the next major version.
     * Prefer other methods that fetch visitors.
     */
    findVisitors(query: object, appId: string): Promise<Array<IVisitor>>;
    findVisitorById(id: string, appId: string): Promise<IVisitor | undefined>;
    findVisitorsByEmail(email: string, appId: string): Promise<Array<IVisitor>>;
    findVisitorsByPhoneNumber(phoneNumber: string, appdId: string): Promise<Array<IVisitor>>;
    transferVisitor(visitor: IVisitor, transferData: ILivechatTransferData, appId: string): Promise<boolean>;
    createRoom(visitor: IVisitor, agent: IUser, appId: string): Promise<ILivechatRoom>;
    closeRoom(room: ILivechatRoom, comment: string, appId: string): Promise<boolean>;
    findRooms(visitor: IVisitor, departmentId: string | null, appId: string): Promise<Array<ILivechatRoom>>;
    /**
     * @deprecated This method does not adhere to the conversion practices applied
     * elsewhere in the Apps-Engine and will be removed in the next major version.
     * Prefer other methods that fetch departments.
     */
    findDepartments(query: object, appId: string): Promise<Array<IDepartment>>;
    findDepartmentsByIdOrName(query: string, appdId: string): Promise<Array<IDepartment>>;
}
