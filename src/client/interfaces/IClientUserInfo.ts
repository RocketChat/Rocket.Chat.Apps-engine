/**
 * Represents the user's information returned to
 * the external component.
 */
export interface IClientUserInfo {
    /**
     * the user id of the Rocket.Chat user
     */
    userId: string;
    /**
     * the username of the Rocket.Chat user
     */
    username: string;
    /**
     * the avatar URL of the Rocket.Chat user
     */
    avatarUrl: string;
}
