import { App } from '../../definition/App';
import { IOAuth2ClientOptions, OAuth2Client } from './OAuth2Client';

/**
 * Placeholder factory for OAuth2Client in case
 * we need to pass internal stuff to it.
 *
 * @param app App that will connect via OAuth2
 * @param options Options for the OAuth2Client
 * @returns OAuth2Client instance
 */
export function createOAuth2Client(app: App, options: IOAuth2ClientOptions): OAuth2Client {
    return new OAuth2Client(app, options);
}
