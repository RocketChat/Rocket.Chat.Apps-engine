import { IDepartment, ILivechatMessage, ILivechatRoom, ILivechatTransferData, IVisitor } from '../../definition/livechat';
import { IUser } from '../../definition/users';

export interface ILivechatBridge {
    /**
     * @deprecated please use the `isOnlineAsync` method instead.
     * In the next major, this method will be `async`
     */
    doIsOnline(departmentId?: string, appId?: string): boolean;
    doIsOnlineAsync(departmentId?: string, appId?: string): Promise<boolean>;
    doCreateMessage(message: ILivechatMessage, appId: string): Promise<string>;
    doGetMessageById(messageId: string, appId: string): Promise<ILivechatMessage>;
    doUpdateMessage(message: ILivechatMessage, appId: string): Promise<void>;
    doCreateVisitor(visitor: IVisitor, appId: string): Promise<string>;
    /**
     * @deprecated This method does not adhere to the conversion practices applied
     * elsewhere in the Apps-Engine and will be removed in the next major version.
     * Prefer other methods that fetch visitors.
     */
    doFindVisitors(query: object, appId: string): Promise<Array<IVisitor>>;
    doFindVisitorById(id: string, appId: string): Promise<IVisitor | undefined>;
    doFindVisitorByEmail(email: string, appId: string): Promise<IVisitor | undefined>;
    doFindVisitorByToken(token: string, appId: string): Promise<IVisitor | undefined>;
    doFindVisitorByPhoneNumber(phoneNumber: string, appdId: string): Promise<IVisitor | undefined>;
    doTransferVisitor(visitor: IVisitor, transferData: ILivechatTransferData, appId: string): Promise<boolean>;
    doCreateRoom(visitor: IVisitor, agent: IUser, appId: string): Promise<ILivechatRoom>;
    doCloseRoom(room: ILivechatRoom, comment: string, appId: string): Promise<boolean>;
    doFindRooms(visitor: IVisitor, departmentId: string | null, appId: string): Promise<Array<ILivechatRoom>>;
    doFindDepartmentsEnabledWithAgents(appId: string): Promise<Array<IDepartment>>;
    doFindDepartmentByIdOrName(value: string, appdId: string): Promise<IDepartment | undefined>;
    doSetCustomFields(data: { token: IVisitor['token']; key: string; value: string; overwrite: boolean }, appId: string): Promise<number>;
}
