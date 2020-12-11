import { ILivechatMessage, ILivechatRoom, ILivechatTransferData, IVisitor } from '../../definition/livechat';
import { IPermission } from '../../definition/permission/IPermission';
import { IUser } from '../../definition/users';

export const LivechatPermissions: { [permission: string]: IPermission } = {
    // isOnline, isOnlineAsync
    // getMessageById, findVisitors, findVisitorsById
    // findVisitorsByEamil, findVisitorsByToken
    // findRooms, findDepartmentByIdOrName
    'livechat.read': {
        name: 'livechat.read',
    },
    // createMessage, updateMessage
    // creaetVisitor, transferVisitor
    // createRoom, closeRoom, setCustomFields
    'livechat.write': {
        name: 'livechat.write',
    },
};

export const AppLivechatBridge = {
    isOnline(departmentId?: string): void {
        return;
    },
    isOnlineAsync(departmentId?: string): void {
        return;
    },
    createMessage(message: ILivechatMessage, appId: string): void {
        return;
    },
    getMessageById(messageId: string, appId: string): void {
        return;
    },
    updateMessage(message: ILivechatMessage, appId: string): void {
        return;
    },
    createVisitor(visitor: IVisitor, appId: string): void {
        return;
    },
    findVisitors(query: object, appId: string): void {
        return;
    },
    findVisitorById(id: string, appId: string): void {
        return;
    },
    findVisitorByEmail(email: string, appId: string): void {
        return;
    },
    findVisitorByToken(token: string, appId: string): void {
        return;
    },
    findVisitorByPhoneNumber(phoneNumber: string, appdId: string): void {
        return;
    },
    transferVisitor(visitor: IVisitor, transferData: ILivechatTransferData, appId: string): void {
        return;
    },
    createRoom(visitor: IVisitor, agent: IUser, appId: string): void {
        return;
    },
    closeRoom(room: ILivechatRoom, comment: string, appId: string): void {
        return;
    },
    findRooms(visitor: IVisitor, departmentId: string | null, appId: string): void {
        return;
    },
    findDepartmentByIdOrName(value: string, appdId: string): void {
        return;
    },
    setCustomFields(data: { token: IVisitor['token']; key: string; value: string; overwrite: boolean }, appId: string): void {
        return;
    },
};
