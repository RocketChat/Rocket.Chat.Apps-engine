import { IPermission } from '../../definition/permission/AppPermission';
import { ISlashCommand } from '../../definition/slashcommands';

export const CommndPermissions: { [permission: string]: IPermission } = {
    // doesCommandExist
    'command.read': {
        name: 'command.read',
    },
    // enableCommand, disableCommand, modifyCommand, restoreCommand, registerCommand
    // unregisterCommand
    'command.write': {
        name: 'command.write',
    },
};

export const AppCommandBridge = {
    doesCommandExist(command: string, appId: string): void {
        return;
    },
    enableCommand(command: string, appId: string): void {
        return;
    },
    disableCommand(command: string, appId: string): void {
        return;
    },
    modifyCommand(command: ISlashCommand, appId: string): void {
        return;
    },
    restoreCommand(command: string, appId: string): void {
        return;
    },
    registerCommand(command: ISlashCommand, appId: string): void {
        return;
    },
    unregisterCommand(command: string, appId: string): void {
        return;
    },
};
