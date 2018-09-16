import { Expect, Test } from 'alsatian';
import { IDesktopNotification } from '../../../definition/notifications';
import { TestData } from '../../test-data/utilities';

import { DesktopNotificationBuilder } from '../../../src/server/accessors';

export class DesktopNotificationBuilderAccessorTestFixture {
    @Test()
    public basicDesktopNotificationBuilder() {
        Expect(() => new DesktopNotificationBuilder()).not.toThrow();
        Expect(() => new DesktopNotificationBuilder(TestData.getDesktopNotification())).not.toThrow();
    }

    @Test()
    public settingOnDesktopNotificationBuilder() {
        const notification: IDesktopNotification = {} as IDesktopNotification;
        const builder = new DesktopNotificationBuilder(notification);

        // Testing the mutation on the original notification object
        Expect(builder.setTitle('Second Builder testing')).toBe(builder);
        Expect((builder as any).notification.title).toEqual('Second Builder testing');
        Expect(notification.title).toEqual('Second Builder testing');

        Expect(builder.setText('Second Builder testing')).toBe(builder);
        Expect((builder as any).notification.text).toEqual('Second Builder testing');
        Expect(notification.text).toEqual('Second Builder testing');

        Expect(builder.setDuration(1259)).toBe(builder);
        Expect((builder as any).notification.duration).toEqual(1259);
        Expect(notification.duration).toEqual(1259);

        Expect(builder.addCustomField('testField', 'Test Value')).toBe(builder);
        Expect((builder as any).notification.customFields.testField).toBeDefined();
        Expect((builder as any).notification.customFields.testField).toEqual('Test Value');
        Expect(notification.customFields).not.toBeEmpty();
        Expect(notification.customFields.testField).toBeDefined();
        Expect(notification.customFields.testField).toEqual('Test Value');

        Expect(builder.getDesktopNotification()).not.toBe(notification);
        Expect(builder.getDesktopNotification()).toEqual(notification);
    }
}
