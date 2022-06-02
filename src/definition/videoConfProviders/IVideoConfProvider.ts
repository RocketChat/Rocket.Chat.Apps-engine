import { IVideoConferenceUser } from '../videoConferences/IVideoConferenceUser';
import { IVideoConferenceOptions } from './IVideoConferenceOptions';
import { VideoConfData, VideoConfDataExtended } from './VideoConfData';

/**
 * Represents a video conference provider
 */
export interface IVideoConfProvider {
    /**
     * The function which gets called when a new video conference url is requested
     */
    generateUrl(call: VideoConfData): Promise<string>;
    /**
     * The function which gets called whenever a user join url is requested
     */
    customizeUrl(call: VideoConfDataExtended, user?: IVideoConferenceUser, options?: IVideoConferenceOptions): Promise<string>;
}
