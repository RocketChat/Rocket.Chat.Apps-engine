import { Expect, Test } from 'alsatian';
import { VideoConference } from '../../../src/definition/videoConferences';
import { VideoConferenceExtender } from '../../../src/server/accessors';
import { TestData } from '../../test-data/utilities';

export class VideoConferenceExtendAccessorTestFixture {
    @Test()
    public basicVideoConferenceExtend() {
        Expect(() => new VideoConferenceExtender({} as VideoConference)).not.toThrow();
        Expect(() => new VideoConferenceExtender(TestData.getVideoConference())).not.toThrow();
    }

    @Test()
    public usingVideoConferenceExtend() {
        const call = { } as VideoConference;
        const extend = new VideoConferenceExtender(call);

        Expect(call.providerData).not.toBeDefined();
        Expect(extend.setProviderData({ key: 'test' })).toBe(extend);
        Expect(call.providerData).toBeDefined();
        Expect(call.providerData.key).toBe('test');

        Expect(extend.getVideoConference()).not.toBe(call);
        Expect(extend.getVideoConference()).toEqual(call);
    }
}
