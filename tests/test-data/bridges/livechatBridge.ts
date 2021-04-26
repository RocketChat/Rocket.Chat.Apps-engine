import { IDepartment, ILivechatMessage, ILivechatRoom, ILivechatTransferData, IVisitor } from '../../../src/definition/livechat';
import { IUser } from '../../../src/definition/users';
import { ILivechatBridge } from '../../../src/server/bridges/ILivechatBridge';

export class TestLivechatBridge implements ILivechatBridge {
    public doFindDepartmentsEnabledWithAgents(appId: string): Promise<Array<IDepartment>> {
        throw new Error('Method not implemented.');
    }
    public doIsOnline(departmentId?: string): boolean {
        throw new Error('Method not implemented');
    }
    public doIsOnlineAsync(departmentId?: string): Promise<boolean> {
        throw new Error('Method not implemented');
    }
    public doCreateMessage(message: ILivechatMessage, appId: string): Promise<string> {
        throw new Error('Method not implemented');
    }
    public doGetMessageById(messageId: string, appId: string): Promise<ILivechatMessage> {
        throw new Error('Method not implemented');
    }
    public doUpdateMessage(message: ILivechatMessage, appId: string): Promise<void> {
        throw new Error('Method not implemented');
    }
    public doCreateVisitor(visitor: IVisitor, appId: string): Promise<string> {
        throw new Error('Method not implemented');
    }
    public doTransferVisitor(visitor: IVisitor, transferData: ILivechatTransferData, appId: string): Promise<boolean> {
        throw new Error('Method not implemented');
    }
    public doFindVisitors(query: object, appId: string): Promise<Array<IVisitor>> {
        console.warn('The method AppLivechatBridge.findVisitors is deprecated. Please consider using its alternatives');
        throw new Error('Method not implemented');
    }
    public doFindVisitorById(id: string, appId: string): Promise<IVisitor | undefined> {
        throw new Error('Method not implemented');
    }
    public doFindVisitorByEmail(email: string, appId: string): Promise<IVisitor | undefined> {
        throw new Error('Method not implemented');
    }
    public doFindVisitorByToken(token: string, appId: string): Promise<IVisitor | undefined> {
        throw new Error('Method not implemented');
    }
    public doFindVisitorByPhoneNumber(phoneNumber: string, appId: string): Promise<IVisitor | undefined> {
        throw new Error('Method not implemented');
    }
    public doCreateRoom(visitor: IVisitor, agent: IUser, appId: string): Promise<ILivechatRoom> {
        throw new Error('Method not implemented');
    }
    public doCloseRoom(room: ILivechatRoom, comment: string, appId: string): Promise<boolean> {
        throw new Error('Method not implemented');
    }
    public doFindRooms(visitor: IVisitor, departmentId: string | null, appId: string): Promise<Array<ILivechatRoom>> {
        throw new Error('Method not implemented');
    }
    public doFindDepartmentByIdOrName(value: string, appId: string): Promise<IDepartment | undefined> {
        throw new Error('Method not implemented');
    }
    public doSetCustomFields(data: { token: IVisitor['token']; key: string; value: string; overwrite: boolean }, appId: string): Promise<number> {
        throw new Error('Method not implemented');
    }
}
