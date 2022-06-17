import { IVideoConferenceUser } from '../videoConferences/IVideoConferenceUser';
import { IVideoConferenceOptions } from './IVideoConferenceOptions';
import { VideoConfData, VideoConfDataExtended } from './VideoConfData';

/**
 * Represents a video conference provider
 */
export interface IVideoConfProvider {
    name: string;

    capabilities?: {
        // Indicates if Rocket.Chat can determine if the user's microphone will start muted or not
        mic?: boolean;
        // Indicates if Rocket.Chat can determine if the user's camera will start turned on or not
        cam?: boolean;
        // Indicates if Rocket.Chat can send a custom title for the video conferences
        title?: boolean;
    };

    // Optional function that can be used to determine if the provider is ready to use or still needs to be configured
    isFullyConfigured?(): Promise<boolean>;

    /**
     * The function which gets called when a new video conference url is requested
     */
    generateUrl(call: VideoConfData): Promise<string>;
    /**
     * The function which gets called whenever a user join url is requested
     */
    customizeUrl(call: VideoConfDataExtended, user?: IVideoConferenceUser, options?: IVideoConferenceOptions): Promise<string>;
}
