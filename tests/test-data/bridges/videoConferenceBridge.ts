import { VideoConference } from '../../../src/definition/videoConferences';
import { VideoConferenceBridge } from '../../../src/server/bridges';

export class TestsVideoConferenceBridge extends VideoConferenceBridge {
    public getById(callId: string, appId: string): Promise<VideoConference> {
        throw new Error('Method not implemented.');
    }

    public update(call: VideoConference, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
