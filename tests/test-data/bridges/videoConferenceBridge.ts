import { IVideoConference } from '../../../src/definition/videoConferences';
import { VideoConferenceBridge } from '../../../src/server/bridges';

export class TestsVideoConferenceBridge extends VideoConferenceBridge {
    public getById(callId: string, appId: string): Promise<IVideoConference> {
        throw new Error('Method not implemented.');
    }
}
