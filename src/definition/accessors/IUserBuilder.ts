import { RocketChatAssociationModel } from '../metadata';
import {IUserCreator} from '../users';

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
     setData(user: IUserCreator): IUserBuilder;

     /**
      * Sets the email of the user
      *
      * @param email the email address of the user
      */
      setEmail(email: string): IUserBuilder;

     /**
      * Gets the email address of the user
      */
      getEmail(): string;

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
       * @param  {string} username username of the user
       */
      setUsername(username: string): IUserBuilder;

      /**
       * Gets the username of this user
       */
      getUsername(): string;

      /**
       * Sets whether the user is active or not
       *
       * @param  {boolean} active active status of user
       */
      setActive(active: boolean): IUserBuilder;

      /**
       * Gets whether the user is active or not
       */
      getActive(): boolean;

      /**
       * Sets the roles for this user
       *
       * @param  {Array<string>} roles roles for a user
       */
      setRoles(roles: Array<string>): IUserBuilder;

      /**
       * Gets the roles of this user
       */
      getRoles(): Array<string>;

      /**
       * Sets whether the user is verified
       *
       * @param  {boolean} verified whether user is verified
       */
      setVerified(verified: boolean): IUserBuilder;

      /**
       * Gets whether the user is verified
       */
      getVerified(): boolean;

      /**
       * Sets whether user can join default channels
       *
       * @param  {boolean} join whether user can join default channels
       */
      setJoinDefaultChannels(join: boolean): IUserBuilder;

      /**
       * Gets whether user can join default channels
       */
      getJoinDefaultChannels(): boolean;

      /**
       * Sets whether user should recieve welcome email
       *
       * @param  {boolean} sendEmail whether user recieve welcome email on succesfull registration
       */
      setSendWelcomeEmail(sendEmail: boolean): IUserBuilder;

      /**
       * Gets whether user can revieve welcome email
       */
      getSendWelcomeEmail(): boolean;

      /**
       * Sets if the user require password change
       *
       * @param  {boolean} require whether the user should require password change on first login
       */
      setRequirePasswordchange(require: boolean): IUserBuilder;

      /**
       * Gets whether user should require password change
       */
      getRequirePasswordchange(): boolean;

      /**
       * Gets the user
       */
      getUser(): IUserCreator;
  }
