export interface IUploadCheckResponse {
    /**
     * Whether to prevent the file upload
     */
    prevent: boolean;
    /**
     * The reason to prevent the file upload
     */
    reason?: string;
    /**
     * The appId of the app who handles file upload event
     */
    appId?: string;
}
