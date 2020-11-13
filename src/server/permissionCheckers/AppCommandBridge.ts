import { ISlashCommand } from '../../definition/slashcommands';

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
