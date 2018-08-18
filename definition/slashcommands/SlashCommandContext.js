"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents  the slash command's context when a user
 * executes a slash command.
 */
class SlashCommandContext {
    constructor(sender, room, params) {
        this.sender = sender;
        this.room = room;
        this.params = params;
    }
    /** The user who sent the command. */
    getSender() {
        return this.sender;
    }
    /** The room where the command was sent in. */
    getRoom() {
        return this.room;
    }
    /** The arguments passed into the command. */
    getArguments() {
        return this.params;
    }
}
exports.SlashCommandContext = SlashCommandContext;

//# sourceMappingURL=SlashCommandContext.js.map
