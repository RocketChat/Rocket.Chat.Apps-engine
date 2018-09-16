import { Expect, Test } from 'alsatian';
import { INotification } from '../../../definition/notifications';
import { TestData } from '../../test-data/utilities';

import { NotificationBuilder } from '../../../src/server/accessors';

export class NotificationBuilderAccessorTestFixture {
    @Test()
    public basicNotificationBuilder() {
        Expect(() => new NotificationBuilder()).not.toThrow();
        Expect(() => new NotificationBuilder(TestData.getNotification())).not.toThrow();
    }

    @Test()
    public settingOnNotificationBuilder() {
        const firstBuilder = new NotificationBuilder();

        Expect(firstBuilder.setMessage('Builder testing')).toBe(firstBuilder);
        Expect((firstBuilder as any).notification.message).toEqual('Builder testing');

        const notification: INotification = {} as INotification;
        const secondBuilder = new NotificationBuilder(notification);

        // Testing the mutation on the original notification object
        Expect(secondBuilder.setMessage('Second Builder testing')).toBe(secondBuilder);
        Expect((secondBuilder as any).notification.message).toEqual('Second Builder testing');
        Expect(notification.message).toEqual('Second Builder testing');

        Expect(secondBuilder.addCustomField('testField', 'Test Value')).toBe(secondBuilder);
        Expect((secondBuilder as any).notification.customFields.testField).toBeDefined();
        Expect((secondBuilder as any).notification.customFields.testField).toEqual('Test Value');
        Expect(notification.customFields).not.toBeEmpty();
        Expect(notification.customFields.testField).toBeDefined();
        Expect(notification.customFields.testField).toEqual('Test Value');

        Expect(secondBuilder.getNotification()).not.toBe(notification);
        Expect(secondBuilder.getNotification()).toEqual(notification);
    }
}
