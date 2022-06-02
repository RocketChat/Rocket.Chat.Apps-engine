import { IVideoConferenceExtender } from '../../definition/accessors';
import { RocketChatAssociationModel } from '../../definition/metadata';
import { VideoConference } from '../../definition/videoConferences';
import { Utilities } from '../misc/Utilities';

export class VideoConferenceExtender implements IVideoConferenceExtender {
    public kind: RocketChatAssociationModel.VIDEO_CONFERENCE;

    constructor(private videoConference: VideoConference) {
        this.kind = RocketChatAssociationModel.VIDEO_CONFERENCE;
    }

    public setProviderData(value: Record<string, any>): IVideoConferenceExtender {
        this.videoConference.providerData = value;

        return this;
    }

    public getVideoConference(): VideoConference {
        return Utilities.deepClone(this.videoConference);
    }
}
