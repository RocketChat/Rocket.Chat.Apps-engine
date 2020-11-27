import { AppStatus } from '../../definition/AppStatus';
import { ProxiedApp } from '../ProxiedApp';

// It seems its an internal bridge and doesn't have
// exposed Api endpoint, might need to remove it later
export const AppActivationBridge = {
    appAdded(app: ProxiedApp): void {
        return;
    },
    appUpdated(app: ProxiedApp): void {
        return;
    },
    appRemoved(app: ProxiedApp): void {
        return;
    },
    appStatusChanged(app: ProxiedApp, status: AppStatus): void {
        return;
    },
};
