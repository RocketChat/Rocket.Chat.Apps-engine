export interface IEmailReader {
    /**
     * Verifies wheter an access token sent through SMTP is correct
     *
     * @param code the code that is going to be verified
     * @param email the email the code was sent
     * @param channel from which channel is the visitor verifying
     * @param visitorId the id from the visitor
     */
    verifyOTPCode(code: string, email: string, visitorId: string, channel: string): Promise<any>;
}
