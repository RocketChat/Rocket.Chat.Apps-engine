import { RocketChatAssociationModel } from '../metadata';
import { VideoConference } from '../videoConferences';

export interface IVideoConferenceExtender {
    kind: RocketChatAssociationModel.VIDEO_CONFERENCE;

    setProviderData(value: Record<string, any>): IVideoConferenceExtender;

    getVideoConference(): VideoConference;
}
