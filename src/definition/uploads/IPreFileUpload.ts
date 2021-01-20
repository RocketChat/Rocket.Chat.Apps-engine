import { IHttp, IModify, IPersistence, IRead } from '../accessors';
import { AppMethod } from '../metadata';
import { IFileUpload } from './IFileUpload';
import { IUploadCheckResponse } from './IUploadCheckResponse';

/**
 * Handler called after a livechat room is closed.
 */
export interface IPreFileUpload {
    /**
     * Method called *after* a livechat room is closed.
     *
     * @param livechatRoom The livechat room which is closed.
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    [AppMethod.EXECUTE_PRE_FILE_UPLOAD](
        data: IFileUpload,
        read: IRead,
        http: IHttp,
        persis: IPersistence,
        modify: IModify,
    ): Promise<IUploadCheckResponse>;
}
