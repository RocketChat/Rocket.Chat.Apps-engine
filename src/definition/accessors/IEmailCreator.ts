export interface IEmailCreator {
    /**
     * Sends an OTP through the configured SMTP server within Rocket.Chat
     *
     * @param email the email that will recieve the TOTP
     * @param channel from which type of channel is the visitor verifying
     * @param visitorId the id from the visitor
     */
    sendOTPThroughSMTP(email: string, channel: string, visitorId: string): Promise<any>;
}
