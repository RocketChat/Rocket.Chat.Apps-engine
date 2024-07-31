export interface IEmailReader {
    /**
     * Verifies wheter an access token sent through SMTP is correct
     *
     * @param code the code that is going to be verified
     * @param email the email the code was sent
     */
    verifyOTPCode(code: string, email: string): Promise<any>;
}
