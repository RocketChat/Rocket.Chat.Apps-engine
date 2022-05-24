import type { IVideoConferenceUser } from './IVideoConferenceUser';

export interface IVideoConference {
    _id: string;
    type: 'direct' | 'videoconference';
    rid: string;
    url: string;
    createdBy: IVideoConferenceUser;
    title?: string;
}
