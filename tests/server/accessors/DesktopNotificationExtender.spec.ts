import { Expect, Test } from 'alsatian';
import { IDesktopNotification } from '../../../definition/notifications';
import { TestData } from '../../test-data/utilities';

import { DesktopNotificationExtender } from '../../../src/server/accessors';

export class DesktopNotificationExtenderAccessorTestFixture {
    @Test()
    public basicDesktopNotificationExtender() {
        Expect(() => new DesktopNotificationExtender({} as IDesktopNotification)).not.toThrow();
        Expect(() => new DesktopNotificationExtender(TestData.getDesktopNotification())).not.toThrow();
    }

    @Test()
    public settingOnDesktopNotificationExtender() {
        const notification: IDesktopNotification = TestData.getDesktopNotification();
        const extender = new DesktopNotificationExtender(notification);

        // Testing the mutation on the original notification object
        Expect(extender.addCustomField('testField', 'Test Value')).toBe(extender);
        Expect((extender as any).notification.customFields.testField).toBeDefined();
        Expect((extender as any).notification.customFields.testField).toEqual('Test Value');
        Expect(notification.customFields).not.toBeEmpty();
        Expect(notification.customFields.testField).toBeDefined();
        Expect(notification.customFields.testField).toEqual('Test Value');

        Expect(() => extender.addCustomField('testField', 'Trying to modify')).toThrow();

        Expect(extender.getDesktopNotification()).not.toBe(notification);
        Expect(extender.getDesktopNotification()).toEqual(notification);
    }
}
