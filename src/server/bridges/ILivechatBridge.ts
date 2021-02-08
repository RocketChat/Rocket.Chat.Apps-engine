import { IDepartment, ILivechatMessage, ILivechatRoom, ILivechatTransferData, IVisitor } from '../../definition/livechat';
import { IUser } from '../../definition/users';

export interface ILivechatBridge {
    /**
     * @deprecated please use the `isOnlineAsync` method instead.
     * In the next major, this method will be `async`
     */
    isOnline(departmentId?: string, appId?: string): boolean;
    isOnlineAsync(departmentId?: string, appId?: string): Promise<boolean>;
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
    findVisitorByEmail(email: string, appId: string): Promise<IVisitor | undefined>;
    findVisitorByToken(token: string, appId: string): Promise<IVisitor | undefined>;
    findVisitorByPhoneNumber(phoneNumber: string, appdId: string): Promise<IVisitor | undefined>;
    transferVisitor(visitor: IVisitor, transferData: ILivechatTransferData, appId: string): Promise<boolean>;
    createRoom(visitor: IVisitor, agent: IUser, appId: string): Promise<ILivechatRoom>;
    closeRoom(room: ILivechatRoom, comment: string, appId: string): Promise<boolean>;
    findRooms(visitor: IVisitor, departmentId: string | null, appId: string): Promise<Array<ILivechatRoom>>;
    findDepartmentByIdOrName(value: string, appdId: string): Promise<IDepartment | undefined>;

    setCustomFields(data: { token: IVisitor['token']; key: string; value: string; overwrite: boolean }, appId: string): Promise<number>;
}
