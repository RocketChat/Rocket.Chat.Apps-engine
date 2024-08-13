import type { IEmailDescriptor } from '../email';

export interface IEmailCreator {
    /**
     * Sends an email through Rocket.Chat
     *
     * @param email the email data
     */
    send(email: IEmailDescriptor): Promise<void>;
}
