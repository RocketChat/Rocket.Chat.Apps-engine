export interface IModerationModify {
    /**
     * Provides a way for Apps to report a message.
     * @param messageId the messageId to report
     * @param description the description of the report
     * @param userId the userId to be reported
     * @param appId the app id
     */
    report(messageId: string, description: string, userId: string, appId: string): Promise<void>;
}
