export interface IModerationModify {
    /**
     * Provides a way for Apps to report a message.
     * @param appId the app id
     * @param messageId the messageId to report
     * @param description the description of the report
     */
    report(messageId: string, description: string, userId: string, appId: string): Promise<void>;
}
