import { IRocketletCommandBridge } from '../bridges/IRocketletCommandBridge';

import { ISlashCommandsModify } from 'temporary-rocketlets-ts-definition/accessors';
import { ISlashCommand } from 'temporary-rocketlets-ts-definition/slashcommands';

export class SlashCommandsModify implements ISlashCommandsModify {
    constructor(private readonly bridge: IRocketletCommandBridge, private readonly rocketletId: string) { }

    public modifySlashCommand(slashCommand: ISlashCommand): void {
        this.bridge.modifyCommand(slashCommand, this.rocketletId);
    }

    public disableSlashCommand(command: string): void {
        this.bridge.disableCommand(command, this.rocketletId);
    }
}
