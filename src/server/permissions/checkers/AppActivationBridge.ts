import { AppStatus } from '../../../definition/AppStatus';
import { ProxiedApp } from '../../ProxiedApp';

// It seems that it's an internal bridge that wasn't exposed.
// Pass all bridge methods by default.
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
