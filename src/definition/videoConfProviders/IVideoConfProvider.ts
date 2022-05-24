import { IVideoConference } from './IVideoConference';
import { IVideoConferenceOptions } from './IVideoConferenceOptions';
import { IVideoConferenceUser } from './IVideoConferenceUser';

/**
 * Represents a video conference provider
 */
export interface IVideoConfProvider {
    /**
     * The function which gets called when a new video conference url is requested
     */
    generateUrl(callId: string): Promise<string>;
    /**
     * The function which gets called whenever a user join url is requested
     */
    customizeUrl(call: IVideoConference, user: IVideoConferenceUser, options: IVideoConferenceOptions): Promise<string>;
}
