export enum TextObjectType {
    MARKDOWN = 'mrkdwn',
    PLAINTEXT = 'plain_text',
}

export interface ITextObject {
    type: TextObjectType;
    text: string;
}

export interface IPlainTextObject extends ITextObject {
    type: TextObjectType.PLAINTEXT;
    emoji?: boolean;
}

export interface IConfirmationObject {
    title: IPlainTextObject;
    text: ITextObject;
    confirm: IPlainTextObject;
    deny: IPlainTextObject;
}
