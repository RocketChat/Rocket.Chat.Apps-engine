import { IAppActivationBridge } from '../../src/server/bridges';
import { ProxiedApp } from '../../src/server/ProxiedApp';

export class DevActivationBridge implements IAppActivationBridge {
    public appEnabled(app: ProxiedApp): void {
        console.log(`The App ${ app.getName() } (${ app.getID() }) has been enabled.`);
    }

    public appDisabled(app: ProxiedApp): void {
        console.log(`The App ${ app.getName() } (${ app.getID() }) has been disabled.`);
    }

    public appLoaded(app: ProxiedApp, enabled: boolean): void {
        console.log(`The App ${ app.getName() } (${ app.getID() }) has been loaded.`);
    }

    public appUpdated(app: ProxiedApp, enabled: boolean): void {
        console.log(`The App ${ app.getName() } (${ app.getID() }) has been updated.`);
    }

    public appRemoved(app: ProxiedApp): void {
        console.log(`The App ${ app.getName() } (${ app.getID() }) has been removed.`);
    }
}
