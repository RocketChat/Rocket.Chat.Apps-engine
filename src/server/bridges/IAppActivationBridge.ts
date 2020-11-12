import { AppStatus } from '../../definition/AppStatus';
import { ProxiedApp } from '../ProxiedApp';

export interface IAppActivationBridge {
    name: string;
    appAdded(app: ProxiedApp): Promise<void>;
    appUpdated(app: ProxiedApp): Promise<void>;
    appRemoved(app: ProxiedApp): Promise<void>;
    appStatusChanged(app: ProxiedApp, status: AppStatus): Promise<void>;
}
