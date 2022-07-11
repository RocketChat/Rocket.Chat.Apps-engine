export interface IOAuthApp {
    id: string;
    name: string;
    active: boolean;
    clientId?: string;
    clientSecret?: string;
    redirectUri: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy: { username: string; id: string };
}

export type IOAuthAppParams = Omit<IOAuthApp, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'appId'>;

export interface IOAuthApps {
    /**
     * Create an OAuthApp
     * @param OAuthApp - the OAuth app to create, in case the clientId and the clientSecret is not sent it will generate automatically
     * @param appId - the app id
     */
    createOAuthApp(OAuthApp: IOAuthAppParams, appId: string): Promise<string>;
    /**
     * Returns the OAuth app info by its id
     * @param id - OAuth app id
     * @param appId - the app id
     */
    getOAuthAppById(id: string, appId: string): Promise<IOAuthApp>;
    /**
     * Returns the OAuth app info by its name
     * @param name - OAuth app name
     * @param appId - the app id
     */
    getOAuthAppByName(name: string, appId: string): Promise<Array<IOAuthApp>>;
    /**
     * Update the OAuth app info
     * @param OAuthApp - OAuth data that will be updated
     * @param id - OAuth app id
     * @param appId - the app id
     */
    updateOAuthApp(OAuthApp: IOAuthAppParams, id: string, appId: string): Promise<void>;
    /**
     * Deletes the OAuth app
     * @param id - OAuth app id
     * @param appId - the app id
     */
    deleteOAuthApp(id: string, appId: string): Promise<void>;
}
