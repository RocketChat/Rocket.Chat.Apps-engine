import { IMessage } from '.';

export interface IDiscussionMessage extends IMessage {
    drid: string;
    dlm?: Date;
    dcount: number;
}
