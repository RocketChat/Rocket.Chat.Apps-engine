export interface IEmailCreator {
    /**
     * Sends an OTP through the configured SMTP server within Rocket.Chat
     *
     * @param email the email that will recieve the TOTP
     */
    sendOTPThroughSMTP(email: string): Promise<any>;
}
