import { IBlockitResponse } from '../../../src/definition/blockit';
import { IUser } from '../../../src/definition/users';
import { IUiInteractionBridge } from '../../../src/server/bridges';

export class TestsUiIntegrationBridge implements IUiInteractionBridge {
    public async notifyUser(user: IUser, interaction: IBlockitResponse, appId: string) {
        throw new Error('Method not implemented.');
    }
}
