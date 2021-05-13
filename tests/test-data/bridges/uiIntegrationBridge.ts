import { IUIKitInteractionParam } from '../../../src/definition/accessors/IUIController';
import { IUser } from '../../../src/definition/users';
import { UiInteractionBridge } from '../../../src/server/bridges';

export class TestsUiIntegrationBridge {
    public async doNotifyUser(user: IUser, interaction: IUIKitInteractionParam, appId: string) {
        throw new Error('Method not implemented.');
    }
}
