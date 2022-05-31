import type { IVideoConferenceUser } from './IVideoConferenceUser';

export interface INewVideoConference {
    _id: string;
    type: 'direct' | 'videoconference';
    rid: string;
    createdBy: IVideoConferenceUser;
    title?: string;
}

export interface IVideoConference extends INewVideoConference {
    url: string;
}
