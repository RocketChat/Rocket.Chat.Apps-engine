import { ACTION_ID_LENGTH } from './constants';
import { randomString } from './utils';

export class AppEmbeddedSDK {
    private listener: (this: Window, ev: MessageEvent) => any;
    private callbacks: Map<string, (response: any) => any>;

    constructor() {
        this.listener = () => console.log('init');
        this.callbacks = new Map();
    }

    public getUserInfo(): Promise<any> {
        return this.call(AppEmbeddedSDKActions.GET_USER_INFO);
    }

    public getRoomInfo(): Promise<any> {
        return this.call(AppEmbeddedSDKActions.GET_ROOM_INFO);
    }

    /**
     * Initialize the App Embedded SDK for communicating with Rocket.Chat
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

export enum AppEmbeddedSDKActions {
    GET_USER_INFO = 'getUserInfo',
    GET_ROOM_INFO = 'getRoomInfo',
}
