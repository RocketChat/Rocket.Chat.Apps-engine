import { Expect, Test } from 'alsatian';
import { INotification } from '../../../definition/notifications';
import { TestData } from '../../test-data/utilities';

import { NotificationExtender } from '../../../src/server/accessors';

export class NotificationExtenderAccessorTestFixture {
    @Test()
    public basicNotificationExtender() {
        Expect(() => new NotificationExtender({} as INotification)).not.toThrow();
        Expect(() => new NotificationExtender(TestData.getNotification())).not.toThrow();
    }

    @Test()
    public settingOnNotificationExtender() {
        const notification: INotification = TestData.getNotification();
        const extender = new NotificationExtender(notification);

        // Testing the mutation on the original notification object
        Expect(extender.addCustomField('testField', 'Test Value')).toBe(extender);
        Expect((extender as any).notification.customFields.testField).toBeDefined();
        Expect((extender as any).notification.customFields.testField).toEqual('Test Value');
        Expect(notification.customFields).not.toBeEmpty();
        Expect(notification.customFields.testField).toBeDefined();
        Expect(notification.customFields.testField).toEqual('Test Value');

        Expect(() => extender.addCustomField('testField', 'Trying to modify')).toThrow();

        Expect(extender.getNotification()).not.toBe(notification);
        Expect(extender.getNotification()).toEqual(notification);
    }
}
