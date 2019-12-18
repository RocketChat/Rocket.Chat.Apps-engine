import { IUIKitResponse } from '../../../src/definition/uikit';
import { IUser } from '../../../src/definition/users';
import { IUiInteractionBridge } from '../../../src/server/bridges';

export class TestsUiIntegrationBridge implements IUiInteractionBridge {
    public async notifyUser(user: IUser, interaction: IUIKitResponse, appId: string) {
        throw new Error('Method not implemented.');
    }
}
