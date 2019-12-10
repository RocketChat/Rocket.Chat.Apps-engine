import { RocketChatAssociationModel } from '../metadata';
import { IUser, IUserEmail } from '../users';

/**
 * Interface for creating a user.
 * Please note, a username and email provided must be unique else you will NOT
 * be able to successfully save the user object.
 */
export interface IUserBuilder {
    kind: RocketChatAssociationModel.USER;

    /**
     * Provides a convient way to set the data for the user.
     * Note: Providing an "id" field here will be ignored.
     *
     * @param user the user data to set
     */
    setData(user: Partial<IUser>): IUserBuilder;

    /**
     * Sets emails of the user
     *
     * @param emails the array of email addresses of the user
     */
    setEmails(emails: Array<IUserEmail>): IUserBuilder;

    /**
     * Gets emails of the user
     */
    getEmails(): Array<IUserEmail>;

    /**
     * Sets the display name of this user.
     *
     * @param name the display name of the user
     */
    setDisplayName(name: string): IUserBuilder;

    /**
     * Gets the display name of this user.
     */
    getDisplayName(): string;

    /**
     * Sets the username for the user
     *
     * @param username username of the user
     */
    setUsername(username: string): IUserBuilder;

    /**
     * Gets the username of this user
     */
    getUsername(): string;

    /**
     * Sets whether the user is active or not
     *
     * @param active active status of the user
     */
    setActive(active: boolean): IUserBuilder;

    /**
     * Gets whether the user is active or not
     */
    getActive(): boolean;

    /**
     * Sets the roles for this user
     *
     * @param roles roles for a user
     */
    setRoles(roles: Array<string>): IUserBuilder;

    /**
     * Gets the roles of this user
     */
    getRoles(): Array<string>;

    /**
     * Sets whether the user is verified
     *
     * @param verified whether user is verified
     */
    setVerified(verified: boolean): IUserBuilder;

    /**
     * Gets whether this user is verified
     */
    getVerified(): boolean;

    /**
     * Sets whether user can join default channels
     *
     * @param join whether user can join default channels
     */
    setJoinDefaultChannels(join: boolean): IUserBuilder;

    /**
     * Gets whether this user can join default channels
     */
    getJoinDefaultChannels(): boolean;

    /**
     * Sets whether the user should recieve welcome email
     *
     * @param sendEmail whether user recieve welcome email on succesfull registration
     */
    setSendWelcomeEmail(sendEmail: boolean): IUserBuilder;

    /**
     * Gets whether this user can revieve welcome email
     */
    getSendWelcomeEmail(): boolean;

    /**
     * Sets whether requiring the user to change the password
     *
     * @param require the user should be required to change the password on the first login
     */
    setRequirePasswordchange(require: boolean): IUserBuilder;

    /**
     * Gets whether requiring this user to change the password
     */
    getRequirePasswordchange(): boolean;

    /**
     * Gets the user
     */
    getUser(): Partial<IUser>;
}
