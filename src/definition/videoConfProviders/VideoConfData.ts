import type { GroupVideoConference, VideoConference } from '../videoConferences/VideoConference';

export type VideoConfData = Pick<VideoConference, '_id' | 'type' | 'rid' | 'createdBy'> & { title?: GroupVideoConference['title'] };

export type VideoConfDataExtended = VideoConfData & Required<Pick<VideoConference, 'url'>>;
