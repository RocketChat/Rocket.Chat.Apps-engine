import { ILivechatMessage } from '../../../src/definition/livechat/ILivechatMessage';
import { ILivechatRoom } from '../../../src/definition/livechat/ILivechatRoom';
import { IVisitor } from '../../../src/definition/livechat/IVisitor';
import { IUser } from '../../../src/definition/users';
import { ILivechatBridge } from '../../../src/server/bridges/ILivechatBridge';

export class TestLivechatBridge implements ILivechatBridge {
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
    public findVisitors(query: object, appId: string): Promise<Array<IVisitor>> {
        throw new Error('Method not implemented');
    }
    public createRoom(visitor: IVisitor, agent: IUser, appId: string): Promise<ILivechatRoom> {
        throw new Error('Method not implemented');
    }
    public findRooms(visitor: IVisitor, departmentId: string | null, appId: string): Promise<Array<ILivechatRoom>> {
        throw new Error('Method not implemented');
    }
}
