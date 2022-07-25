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

export interface IOAuthAppsReader {
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
}
