import { INotification } from './INotification';

export interface IDesktopNotification extends INotification {
    title: string;
    text: string;
    duration: number;
}
