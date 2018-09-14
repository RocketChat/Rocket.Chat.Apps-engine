import { INotificationExtender } from '../../../definition/accessors';
import { INotification } from '../../../definition/notifications';

import { Utilities } from '../../misc/Utilities';

export class NotificationExtender implements INotificationExtender {
    constructor(private notification: INotification) {}

    public addCustomField(key: string, value: any): INotificationExtender {
        if (!this.notification.customFields) {
            this.notification.customFields = {};
        }

        if (this.notification.customFields[key]) {
            throw new Error(`The notification already contains a custom field by the key: ${ key }`);
        }

        this.notification.customFields[key] = value;

        return this;
    }

    public getNotification(): INotification {
        return Utilities.deepClone(this.notification);
    }
}
