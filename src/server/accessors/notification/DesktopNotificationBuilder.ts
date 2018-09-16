import { IDesktopNotificationBuilder } from '../../../definition/accessors';
import { IDesktopNotification } from '../../../definition/notifications';

import { Utilities } from '../../misc/Utilities';

export class DesktopNotificationBuilder implements IDesktopNotificationBuilder {
    private notification: IDesktopNotification;

    constructor(notification?: IDesktopNotification) {
        this.notification = notification || ({} as IDesktopNotification);
    }

    public setTitle(title: string): IDesktopNotificationBuilder {
        this.notification.title = title;

        return this;
    }

    public setText(text: string): IDesktopNotificationBuilder {
        this.notification.text = text;

        return this;
    }

    public setDuration(duration: number): IDesktopNotificationBuilder {
        this.notification.duration = duration;

        return this;
    }

    public addCustomField(key: string, value: any): IDesktopNotificationBuilder {
        if (!this.notification.customFields) {
            this.notification.customFields = {};
        }

        this.notification.customFields[key] = value;

        return this;
    }

    public getDesktopNotification(): IDesktopNotification {
        return Utilities.deepClone(this.notification);
    }
}
