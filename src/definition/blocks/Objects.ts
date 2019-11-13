export enum TextObjectType {
    MARKDOWN = 'mrkdwn',
    PLAINTEXT = 'plain_text',
}

export interface ITextObject {
    type: TextObjectType;
    text: string;
    emoji?: boolean;
}

export interface IConfirmationObject {
    title: ITextObject;
    text: ITextObject;
    confirm: ITextObject;
    deny: ITextObject;
}
