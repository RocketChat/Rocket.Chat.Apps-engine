import { IPermission } from '../../definition/permission/IPermission';
import { ISlashCommand } from '../../definition/slashcommands';

export const CommandPermissions: { [permission: string]: IPermission } = {
    // doesCommandExist
    read: {
        name: 'command.read',
    },
    // enableCommand, disableCommand, modifyCommand, restoreCommand, registerCommand
    // unregisterCommand
    write: {
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
