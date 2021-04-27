import { IDepartment, ILivechatMessage, ILivechatRoom, ILivechatTransferData, IVisitor } from '../../../src/definition/livechat';
import { IUser } from '../../../src/definition/users';
import { ILivechatBridge } from '../../../src/server/bridges/ILivechatBridge';

export class TestLivechatBridge implements ILivechatBridge {
    public findDepartmentsEnabledWithAgents(appId: string): Promise<Array<IDepartment>> {
        throw new Error('Method not implemented.');
    }
    public isOnline(departmentId?: string): boolean {
        throw new Error('Method not implemented');
    }
    public isOnlineAsync(departmentId?: string): Promise<boolean> {
        throw new Error('Method not implemented');
    }
    public createMessage(message: ILivechatMessage, appId: string): Promise<string> {
        throw new Error('Method not implemented');
    }
    public getMessageById(messageId: string, appId: string): Promise<ILivechatMessage> {
        throw new Error('Method not implemented');
    }
    public updateMessage(message: ILivechatMessage, appId: string): Promise<void> {
        throw new Error('Method not implemented');
    }
    public createVisitor(visitor: IVisitor, appId: string): Promise<string> {
        throw new Error('Method not implemented');
    }
    public transferVisitor(visitor: IVisitor, transferData: ILivechatTransferData, appId: string): Promise<boolean> {
        throw new Error('Method not implemented');
    }
    public findVisitors(query: object, appId: string): Promise<Array<IVisitor>> {
        console.warn('The method AppLivechatBridge.findVisitors is deprecated. Please consider using its alternatives');
        throw new Error('Method not implemented');
    }
    public findVisitorById(id: string, appId: string): Promise<IVisitor | undefined> {
        throw new Error('Method not implemented');
    }
    public findVisitorByEmail(email: string, appId: string): Promise<IVisitor | undefined> {
        throw new Error('Method not implemented');
    }
    public findVisitorByToken(token: string, appId: string): Promise<IVisitor | undefined> {
        throw new Error('Method not implemented');
    }
    public findVisitorByPhoneNumber(phoneNumber: string, appId: string): Promise<IVisitor | undefined> {
        throw new Error('Method not implemented');
    }
    public createRoom(visitor: IVisitor, agent: IUser, appId: string): Promise<ILivechatRoom> {
        throw new Error('Method not implemented');
    }
    public closeRoom(room: ILivechatRoom, comment: string, appId: string): Promise<boolean> {
        throw new Error('Method not implemented');
    }
    public findRooms(visitor: IVisitor, departmentId: string | null, appId: string): Promise<Array<ILivechatRoom>> {
        throw new Error('Method not implemented');
    }
    public findDepartmentByIdOrName(value: string, appId: string): Promise<IDepartment | undefined> {
        throw new Error('Method not implemented');
    }
    public setCustomFields(data: { token: IVisitor['token']; key: string; value: string; overwrite: boolean }, appId: string): Promise<number> {
        throw new Error('Method not implemented');
    }
}
