import { ProxiedApp } from '../ProxiedApp';

export interface IAppActivationBridge {
    appEnabled(app: ProxiedApp): void;
    appDisabled(app: ProxiedApp): void;
    appLoaded(app: ProxiedApp, enabled: boolean): void;
    appUpdated(app: ProxiedApp, enabled: boolean): void;
    appRemoved(app: ProxiedApp): void;
}
