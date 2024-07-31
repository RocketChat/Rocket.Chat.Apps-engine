export interface ISMTPOTPReader {
    /**
     * Verifies wheter an access token sent through SMTP is correct
     *
     * @param code the code that is going to be verified
     */
    verifyOTPCode(code: string): Promise<any>;
}
