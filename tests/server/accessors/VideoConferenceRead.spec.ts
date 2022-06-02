import { AsyncTest, Expect, SetupFixture } from 'alsatian';
import { IVideoConference } from '../../../src/definition/videoConferences';

import { VideoConferenceRead } from '../../../src/server/accessors';
import { VideoConferenceBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

export class VideoConferenceReadAccessorTestFixture {
    private videoConference: IVideoConference;
    private mockVideoConfBridge: VideoConferenceBridge;

    @SetupFixture
    public setupFixture() {
        this.videoConference = TestData.getVideoConference();

        const call = this.videoConference;
        this.mockVideoConfBridge = {
            doGetById(id, appId): Promise<IVideoConference> {
                return Promise.resolve(call);
            },
        } as VideoConferenceBridge;
    }

    @AsyncTest()
    public async expectDataFromVideoConferenceRead() {
        Expect(() => new VideoConferenceRead(this.mockVideoConfBridge, 'testing-app')).not.toThrow();

        const read = new VideoConferenceRead(this.mockVideoConfBridge, 'testing-app');

        Expect(await read.getById('fake')).toBeDefined();
        Expect(await read.getById('fake')).toBe(this.videoConference);
    }
}
