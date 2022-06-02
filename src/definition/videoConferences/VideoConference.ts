// tslint:disable:interface-over-type-literal
import { IVideoConferenceUser } from './IVideoConferenceUser';

export type VideoConferenceMember = IVideoConferenceUser & {
    ts: Date;
};

export enum VideoConferenceStatus {
    CALLING = 0,
    STARTED = 1,
    ENDED = 2,
}

export type BaseVideoConference = {
    _id: string;
    _updatedAt: Date;
    type: 'direct' | 'videoconference';
    rid: string;
    users: Array<VideoConferenceMember>;
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
};

export type DirectVideoConference = BaseVideoConference & {
    type: 'direct';
};

export type GroupVideoConference = BaseVideoConference & {
    type: 'videoconference';
    anonymousUsers: number;
    title: string;
};

export type VideoConference = DirectVideoConference | GroupVideoConference;
