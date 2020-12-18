import { ISlashCommand } from '../../../definition/slashcommands';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppCommandBridge = {
    hasReadPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.command.read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.command.read],
            });
        }
    },
    hasWritePermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.command.write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.command.write],
            });
        }
    },
    doesCommandExist(command: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    enableCommand(command: string, appId: string): void {
        return this.hasWritePermission(appId);
    },
    disableCommand(command: string, appId: string): void {
        return this.hasWritePermission(appId);
    },
    modifyCommand(command: ISlashCommand, appId: string): void {
        return this.hasWritePermission(appId);
    },
    restoreCommand(command: string, appId: string): void {
        return this.hasWritePermission(appId);
    },
    registerCommand(command: ISlashCommand, appId: string): void {
        return this.hasWritePermission(appId);
    },
    unregisterCommand(command: string, appId: string): void {
        return this.hasWritePermission(appId);
    },
};
