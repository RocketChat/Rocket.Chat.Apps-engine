import { ACTION_ID_LENGTH } from './constants';
import { IClientRoomInfo, IClientUserInfo } from './definition';
import { EClientEmbeddedSDKActions } from './definition/EClientEmbeddedSDKActions';
import { randomString } from './utils';

/**
 * Represents the SDK provided to the external component.
 */
export class AppClientEmbeddedSDK {
    private listener: (this: Window, ev: MessageEvent) => any;
    private callbacks: Map<string, (response: any) => any>;

    constructor() {
        this.listener = () => console.log('init');
        this.callbacks = new Map();
    }
    /**
     * Get the current user's information.
     *
     * @return the information of the current user.
     */
    public getUserInfo(): Promise<IClientUserInfo> {
        return this.call(EClientEmbeddedSDKActions.GET_USER_INFO);
    }
    /**
     * Get the current room's information.
     *
     * @return the information of the current room.
     */
    public getRoomInfo(): Promise<IClientRoomInfo> {
        return this.call(EClientEmbeddedSDKActions.GET_ROOM_INFO);
    }

    /**
     * Initialize the app embedded SDK for communicating with Rocket.Chat
     */
    public init(): void {
        this.listener = ({ data }) => {
            if (!data.hasOwnProperty('rcEmbeddedSDK')) {
                return;
            }

            const { rcEmbeddedSDK: { id, payload } } = data;

            if (this.callbacks.has(id)) {
                const resolve = this.callbacks.get(id);

                if (typeof resolve === 'function') {
                    resolve(payload);
                }
                this.callbacks.delete(id);
            }
        };
        window.addEventListener('message', this.listener);
    }

    private call(action: string, payload?: any ): Promise<any>  {
        return new Promise((resolve) => {
            const id = randomString(ACTION_ID_LENGTH);

            window.parent.postMessage({ rcEmbeddedSDK: { action, payload, id } }, '*');
            this.callbacks.set(id, resolve);
        });
    }
}
