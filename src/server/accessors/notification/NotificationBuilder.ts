import { INotificationBuilder } from '../../../definition/accessors';
import { INotification } from '../../../definition/notifications';

import { Utilities } from '../../misc/Utilities';

export class NotificationBuilder implements INotificationBuilder {
    private notification: INotification;

    constructor(notification?: INotification) {
        this.notification = notification || ({} as INotification);
    }

    public setMessage(message: string): INotificationBuilder {
        this.notification.message = message;

        return this;
    }

    public addCustomField(key: string, value: any): INotificationBuilder {
        if (!this.notification.customFields) {
            this.notification.customFields = {};
        }

        this.notification.customFields[key] = value;

        return this;
    }

    public getNotification(): INotification {
        return Utilities.deepClone(this.notification);
    }
}
