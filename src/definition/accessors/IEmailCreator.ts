export interface IEmailCreator {
    /**
     * Sends an OTP through the configured SMTP server within Rocket.Chat
     *
     * @param email the email that will recieve the TOTP
     * @param code is the code that is going to be sent via email
     * @param language is the language that is going to be used within Rocket.Chat
     */
    sendOTPThroughSMTP(email: string, code: string, language: string): Promise<any>;
}
