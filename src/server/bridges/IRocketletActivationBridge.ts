import { ProxiedRocketlet } from '../ProxiedRocketlet';

export interface IRocketletActivationBridge {
    rocketletEnabled(rocketlet: ProxiedRocketlet): void;
    rocketletDisabled(rocketlet: ProxiedRocketlet): void;
    rocketletLoaded(rocketlet: ProxiedRocketlet, enabled: boolean): void;
    rocketletUpdated(rocketlet: ProxiedRocketlet, enabled: boolean): void;
    rocketletRemoved(rocketlet: ProxiedRocketlet): void;
}
