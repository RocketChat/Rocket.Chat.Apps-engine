import { IUIKitInteractionParam } from '../../../src/definition/accessors/IUIController';
import { IUser } from '../../../src/definition/users';
import { IUiInteractionBridge } from '../../../src/server/bridges';

export class TestsUiIntegrationBridge implements IUiInteractionBridge {
    public name: 'TestsUiIntegrationBridge';
    public async notifyUser(user: IUser, interaction: IUIKitInteractionParam, appId: string) {
        throw new Error('Method not implemented.');
    }
}
