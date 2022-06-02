import type { IVideoConferenceUser } from './IVideoConferenceUser';

export interface IVideoConferenceMember extends IVideoConferenceUser {
    ts: Date;
}

export enum VideoConferenceStatus {
    CALLING = 0,
    STARTED = 1,
    ENDED = 2,
}

export interface IVideoConference {
    _id: string;
    _updatedAt: Date;
    type: 'direct' | 'videoconference';
    rid: string;
    users: Array<IVideoConferenceMember>;
    status: VideoConferenceStatus;
    messages: {
        started?: string;
        ended?: string;
    };
    url?: string;

    createdBy: IVideoConferenceUser;
    createdAt: Date;

    endedBy?: IVideoConferenceUser;
    endedAt?: Date;
}

export interface IDirectVideoConference extends IVideoConference {
    type: 'direct';
}

export interface IGroupVideoConference extends IVideoConference {
    type: 'videoconference';
    anonymousUsers: number;
    title: string;
}
