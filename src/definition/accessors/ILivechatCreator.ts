import { ILivechatRoom, IVisitor } from '../livechat';
import { IUser } from '../users';

export interface ILivechatCreator {
    /**
     * Creates a room to connect the `visitor` to an `agent`.
     *
     * This method uses the Livechat routing method configured
     * in the server
     *
     * @param visitor The Livechat Visitor that started the conversation
     * @param agent The agent responsible for the room
     */
    createRoom(visitor: IVisitor, agent: IUser): Promise<ILivechatRoom>;
    /**
     * Creates a Livechat visitor
     *
     * @param visitor Data of the visitor to be created
     */
    createVisitor(visitor: IVisitor): Promise<string>;

    /**
     * Creates a token to be used when
     * creating a new livechat visitor
     */
    createToken(): string;
}
