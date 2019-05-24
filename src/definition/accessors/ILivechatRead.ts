import { ILivechatRoom } from '../livechat/ILivechatRoom';
import { IVisitor } from '../livechat/IVisitor';

export interface ILivechatRead {
    getLivechatRoom(visitor: IVisitor, departmentId?: string): Promise<Array<ILivechatRoom>>;
    getLivechatVisitor(query: object): Promise<Array<IVisitor>>;
}
