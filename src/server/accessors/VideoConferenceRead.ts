import { IVideoConferenceRead } from '../../definition/accessors';
import { VideoConference } from '../../definition/videoConferences';

import { VideoConferenceBridge } from '../bridges';

export class VideoConferenceRead implements IVideoConferenceRead {
    constructor(private videoConfBridge: VideoConferenceBridge, private appId: string) { }

    public getById(id: string): Promise<VideoConference> {
        return this.videoConfBridge.doGetById(id, this.appId);
    }
}
