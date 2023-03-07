export interface IModerationModify {
    /**
     * Provides a way for Apps to report a message.
     * @param appId the app id
     * @param messageId the messageId to report
     * @param description the description of the report
     */
    report(appId: string, messageId: string, description: string): Promise<void>;
}