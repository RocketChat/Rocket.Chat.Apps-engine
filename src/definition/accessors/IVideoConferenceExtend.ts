import { RocketChatAssociationModel } from '../metadata';
import { IVideoConferenceUser, VideoConference } from '../videoConferences';
import { VideoConferenceMember } from '../videoConferences/IVideoConference';

export interface IVideoConferenceExtender {
    kind: RocketChatAssociationModel.VIDEO_CONFERENCE;

    setProviderData(value: Record<string, any>): IVideoConferenceExtender;

    setStatus(value: VideoConference['status']): IVideoConferenceExtender;

    setEndedBy(value: IVideoConferenceUser['_id']): IVideoConferenceExtender;

    setEndedAt(value: VideoConference['endedAt']): IVideoConferenceExtender;

    addUser(userId: VideoConferenceMember['_id'], ts?: VideoConferenceMember['ts']): IVideoConferenceExtender;

    getVideoConference(): VideoConference;
}
