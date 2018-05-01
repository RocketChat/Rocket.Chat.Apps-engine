import { AppStatus } from '@rocket.chat/apps-ts-definition/AppStatus';
import { IAppActivationBridge } from '../../../src/server/bridges';
import { ProxiedApp } from '../../../src/server/ProxiedApp';

export class TestsActivationBridge implements IAppActivationBridge {
    public async appAdded(app: ProxiedApp): Promise<void> {
        console.log(`The App ${ app.getName() } (${ app.getID() }) has been added.`);
    }

    public async appUpdated(app: ProxiedApp): Promise<void> {
        console.log(`The App ${ app.getName() } (${ app.getID() }) has been updated.`);
    }

    public async appRemoved(app: ProxiedApp): Promise<void> {
        console.log(`The App ${ app.getName() } (${ app.getID() }) has been removed.`);
    }

    public async appStatusChanged(app: ProxiedApp, status: AppStatus): Promise<void> {
        console.log(`The App ${ app.getName() } (${ app.getID() }) status has changed to: ${ status }`);
    }
}
