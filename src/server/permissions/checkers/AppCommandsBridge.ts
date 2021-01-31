import { ISlashCommand } from '../../../definition/slashcommands';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppCommandsBridge = {
    hasPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.command.default)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.command.default],
            });
        }
    },
    doesCommandExist(command: string, appId: string): void {
        return this.hasPermission(appId);
    },
    enableCommand(command: string, appId: string): void {
        return this.hasPermission(appId);
    },
    disableCommand(command: string, appId: string): void {
        return this.hasPermission(appId);
    },
    modifyCommand(command: ISlashCommand, appId: string): void {
        return this.hasPermission(appId);
    },
    restoreCommand(command: string, appId: string): void {
        return this.hasPermission(appId);
    },
    registerCommand(command: ISlashCommand, appId: string): void {
        return this.hasPermission(appId);
    },
    unregisterCommand(command: string, appId: string): void {
        return this.hasPermission(appId);
    },
};
