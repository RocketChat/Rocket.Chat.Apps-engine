import { IRoom } from '../rooms';
import { IUser } from '../users';
/**
 * Represents  the slash command's context when a user
 * executes a slash command.
 */
export declare class SlashCommandContext {
    private sender;
    private room;
    private params;
    constructor(sender: IUser, room: IRoom, params: Array<string>);
    /** The user who sent the command. */
    getSender(): IUser;
    /** The room where the command was sent in. */
    getRoom(): IRoom;
    /** The arguments passed into the command. */
    getArguments(): Array<string>;
}
