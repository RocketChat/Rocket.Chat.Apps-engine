import { IRocketletActivationBridge } from '../../src/server/bridges';
import { ProxiedRocketlet } from '../../src/server/ProxiedRocketlet';

export class DevActivationBridge implements IRocketletActivationBridge {
    public rocketletEnabled(rocketlet: ProxiedRocketlet): void {
        console.log(`The Rocketlet ${ rocketlet.getName() } (${ rocketlet.getID() }) has been enabled.`);
    }

    public rocketletDisabled(rocketlet: ProxiedRocketlet): void {
        console.log(`The Rocketlet ${ rocketlet.getName() } (${ rocketlet.getID() }) has been disabled.`);
    }

    public rocketletLoaded(rocketlet: ProxiedRocketlet, enabled: boolean): void {
        console.log(`The Rocketlet ${ rocketlet.getName() } (${ rocketlet.getID() }) has been loaded.`);
    }

    public rocketletUpdated(rocketlet: ProxiedRocketlet, enabled: boolean): void {
        console.log(`The Rocketlet ${ rocketlet.getName() } (${ rocketlet.getID() }) has been updated.`);
    }

    public rocketletRemoved(rocketlet: ProxiedRocketlet): void {
        console.log(`The Rocketlet ${ rocketlet.getName() } (${ rocketlet.getID() }) has been removed.`);
    }
}
