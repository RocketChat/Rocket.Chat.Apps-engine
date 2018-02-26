import { AppStatus } from '@rocket.chat/apps-ts-definition/AppStatus';
import { ProxiedApp } from '../ProxiedApp';

export interface IAppActivationBridge {
    appAdded(app: ProxiedApp): void;
    appUpdated(app: ProxiedApp): void;
    appRemoved(app: ProxiedApp): void;
    appStatusChanged(app: ProxiedApp, status: AppStatus): void;
}
