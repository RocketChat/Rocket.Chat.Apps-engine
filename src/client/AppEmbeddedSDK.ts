import { ACTION_ID_LENGTH } from './constants';
import { randomString } from './utils';

export class AppEmbeddedSDK {
    public persistence = {
        getItem: async (key: string) => {
            const { value } = await this.call(AppEmbeddedSDKActions.PERSISTENCE_GET_ITEM, { key });

            return value;
        },
        setItem: (key: string, value: any) => {
            this.call(AppEmbeddedSDKActions.PERSISTENCE_SET_ITEM, { key, value });
        },
        getAll: () => {
            return this.call(AppEmbeddedSDKActions.PERSISTENCE_GET_ALL);
        },
        removeItem: (key: string) => {
            this.call(AppEmbeddedSDKActions.PERSISTENCE_REMOVE_ITEM, { key });
        },
        clear: () => {
            this.call(AppEmbeddedSDKActions.PERSISTENCE_CLEAR);
        },
    };
  
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
    PERSISTENCE_SET_ITEM = 'persistence.setItem',
    PERSISTENCE_GET_ITEM = 'persistence.getItem',
    PERSISTENCE_GET_ALL = 'persistence.getAll',
    PERSISTENCE_REMOVE_ITEM = 'persistence.removeItem',
    PERSISTENCE_CLEAR = 'persistence.clear',
}
