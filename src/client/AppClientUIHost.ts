import {
    ClientSDKActions,
    IClientSDKResponse,
    IExternalComponentRoomInfo,
    IExternalComponentUserInfo,
} from './definition';

/**
 * Represents the host which handlers API calls from external components.
 */
export abstract class AppClientUIHost {
    /**
     * The message emitter who calling the API.
     */
    private emitter!: Window;

    constructor() {
        this.initialize();
    }
    /**
     * initialize the AppClientUIHost by registering window `message` listener
     */
    public initialize() {
        window.addEventListener('message', async ({ data, source }) => {
            this.emitter = source;

            if (!data.hasOwnProperty('rcSDK')) {
                return;
            }
            const { rcSDK: { action, id } } = data;

            switch (action) {
                case ClientSDKActions.GET_USER_INFO:
                    this.handleAction(action, id, await this.getClientUserInfo());
                case ClientSDKActions.GET_ROOM_INFO:
                    this.handleAction(action, id, await this.getClientRoomInfo());
            }
        });
    }
    /**
     * Get the current user's information.
     */
    public abstract async getClientUserInfo(): Promise<IExternalComponentUserInfo>;
    /**
     * Get the opened room's information.
     */
    public abstract async getClientRoomInfo(): Promise<IExternalComponentRoomInfo>;
    /**
     * Handle the action sent from the external component.
     * @param action the name of the action
     * @param id the unique id of the  API call
     * @param data The data that will return to the caller
     */
    private async handleAction(action: ClientSDKActions, id: string, data: IExternalComponentUserInfo | IExternalComponentRoomInfo): Promise<void> {
        if ((this.emitter instanceof MessagePort) || (this.emitter instanceof ServiceWorker)) {
            return;
        }

        this.emitter.postMessage({
            rcSDK: {
                id,
                action,
                payload: data,
            } as IClientSDKResponse,
        }, '*');
    }
}
