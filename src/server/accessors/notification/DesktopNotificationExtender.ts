import { IDesktopNotificationExtender } from '../../../definition/accessors';
import { IDesktopNotification } from '../../../definition/notifications';

import { Utilities } from '../../misc/Utilities';

export class DesktopNotificationExtender implements IDesktopNotificationExtender {
    constructor(private notification: IDesktopNotification) {}

    public addCustomField(key: string, value: any): IDesktopNotificationExtender {
        if (!this.notification.customFields) {
            this.notification.customFields = {};
        }

        if (this.notification.customFields[key]) {
            throw new Error(`The notification already contains a custom field by the key: ${ key }`);
        }

        this.notification.customFields[key] = value;

        return this;
    }

    public getDesktopNotification(): IDesktopNotification {
        return Utilities.deepClone(this.notification);
    }
}
