"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../../definition/metadata");
class MessageBuilder {
    constructor(message) {
        this.kind = metadata_1.RocketChatAssociationModel.MESSAGE;
        this.msg = message ? message : {};
    }
    setData(data) {
        delete data.id;
        this.msg = data;
        return this;
    }
    setRoom(room) {
        this.msg.room = room;
        return this;
    }
    getRoom() {
        return this.msg.room;
    }
    setSender(sender) {
        this.msg.sender = sender;
        return this;
    }
    getSender() {
        return this.msg.sender;
    }
    setText(text) {
        this.msg.text = text;
        return this;
    }
    getText() {
        return this.msg.text;
    }
    setEmojiAvatar(emoji) {
        this.msg.emoji = emoji;
        return this;
    }
    getEmojiAvatar() {
        return this.msg.emoji;
    }
    setAvatarUrl(avatarUrl) {
        this.msg.avatarUrl = avatarUrl;
        return this;
    }
    getAvatarUrl() {
        return this.msg.avatarUrl;
    }
    setUsernameAlias(alias) {
        this.msg.alias = alias;
        return this;
    }
    getUsernameAlias() {
        return this.msg.alias;
    }
    addAttachment(attachment) {
        if (!this.msg.attachments) {
            this.msg.attachments = new Array();
        }
        this.msg.attachments.push(attachment);
        return this;
    }
    setAttachments(attachments) {
        this.msg.attachments = attachments;
        return this;
    }
    getAttachments() {
        return this.msg.attachments;
    }
    replaceAttachment(position, attachment) {
        if (!this.msg.attachments) {
            this.msg.attachments = new Array();
        }
        if (!this.msg.attachments[position]) {
            throw new Error(`No attachment found at the index of "${position}" to replace.`);
        }
        this.msg.attachments[position] = attachment;
        return this;
    }
    removeAttachment(position) {
        if (!this.msg.attachments) {
            this.msg.attachments = new Array();
        }
        if (!this.msg.attachments[position]) {
            throw new Error(`No attachment found at the index of "${position}" to remove.`);
        }
        this.msg.attachments.splice(position, 1);
        return this;
    }
    setEditor(user) {
        this.msg.editor = user;
        return this;
    }
    getEditor() {
        return this.msg.editor;
    }
    getMessage() {
        if (!this.msg.room) {
            throw new Error('The "room" property is required.');
        }
        return this.msg;
    }
}
exports.MessageBuilder = MessageBuilder;

//# sourceMappingURL=MessageBuilder.js.map
