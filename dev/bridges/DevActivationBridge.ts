import { AppStatus } from '@rocket.chat/apps-ts-definition/AppStatus';
import { IAppActivationBridge } from '../../src/server/bridges';
import { ProxiedApp } from '../../src/server/ProxiedApp';

export class DevActivationBridge implements IAppActivationBridge {
    public appAdded(app: ProxiedApp): void {
        console.log(`The App ${ app.getName() } (${ app.getID() }) has been added.`);
    }

    public appUpdated(app: ProxiedApp): void {
        console.log(`The App ${ app.getName() } (${ app.getID() }) has been updated.`);
    }

    public appRemoved(app: ProxiedApp): void {
        console.log(`The App ${ app.getName() } (${ app.getID() }) has been removed.`);
    }

    public appStatusChanged(app: ProxiedApp, status: AppStatus): void {
        console.log(`The App ${ app.getName() } (${ app.getID() }) status has changed to: ${ status }`);
    }
}
