import { IClientRoomInfo, IClientUserInfo } from './index';

/**
 * The response to the AppClientEmbeddedSDK's API call.
 */
export interface IClientEmbeddedSDKResonse {
    /**
     * The name of the action
     */
    action: string;
    /**
     * The unique id of the API call
     */
    id: string;
    /**
     * The data that will return to the caller
     */
    payload: IClientUserInfo | IClientRoomInfo;
}
