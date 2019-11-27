import { IDepartment } from '../livechat';
import { ILivechatRoom } from '../livechat/ILivechatRoom';
import { IVisitor } from '../livechat/IVisitor';

export interface ILivechatRead {
    isOnline(): boolean;
    getLivechatRooms(visitor: IVisitor, departmentId?: string): Promise<Array<ILivechatRoom>>;
    getLivechatVisitors(query: object): Promise<Array<IVisitor>>;
    getLivechatDepartments(query: object): Promise<Array<IDepartment>>;
}
