import { RocketChatAssociationRecord } from '../../definition/metadata';

export interface IPersistenceBridge {
    /**
     * Purges the App's persistant storage data from the persistent storage.
     *
     * @argument appId the id of the app's data to remove
     */
    purge(appId: string): Promise<void>;

    /**
     * Creates a new persistant record with the provided data attached.
     *
     * @argument data the data to store in persistent storage
     * @argument appId the id of the app which is storing the data
     * @returns the id of the stored record
     */
    create(data: object, appId: string): Promise<string>;

    /**
     * Creates a new record in the App's persistent storage with the data being
     * associated with at least one Rocket.Chat record.
     *
     * @argument data the data to store in the persistent storage
     * @argument associations the associations records this data is associated with
     * @argument appId the id of the app which is storing the data
     * @returns the id of the stored record
     */
    // tslint:disable-next-line:max-line-length
    createWithAssociations(data: object, associations: Array<RocketChatAssociationRecord>, appId: string): Promise<string>;

    /**
     * Retrieves from the persistent storage the record by the id provided.
     *
     * @argument id the record id to read
     * @argument appId the id of the app calling this
     * @returns the data stored in the persistent storage, or undefined
     */
    readById(id: string, appId: string): Promise<object>;

    /**
     * Retrieves the data which is associated with the provided records.
     *
     * @argument associations the association records to query about
     * @argument appId the id of the app calling this
     * @returns an array of records if they exist, an empty array otherwise
     */
    readByAssociations(associations: Array<RocketChatAssociationRecord>, appId: string): Promise<Array<object>>;

    /**
     * Removes the record which matches the provided id.
     *
     * @argument id the id of the record
     * @argument appId the id of the app calling this
     * @returns the data being removed
     */
    remove(id: string, appId: string): Promise<object>;

    /**
     * Removes any data which has been associated with the provided records.
     *
     * @argument associations the associations which to remove records
     * @argument appId the id of the app calling this
     * @returns the data of the removed records
     */
    removeByAssociations(associations: Array<RocketChatAssociationRecord>, appId: string): Promise<Array<object>>;

    /**
     * Updates the record in the database, with the option of creating a new one if it doesn't exist.
     *
     * @argument id the id of the record to update
     * @argument data the updated data to set in the record
     * @argument upsert whether to create if the id doesn't exist
     * @argument appId the id of the app calling this
     * @returns the id, whether the new one or the existing one
     */
    update(id: string, data: object, upsert: boolean, appId: string): Promise<string>;

    /**
     * Updates the record in the database, with the option of creating a new one if it doesn't exist.
     *
     * @argument associations the association records to update
     * @argument data the updated data to set in the record
     * @argument upsert whether to create if the id doesn't exist
     * @argument appId the id of the app calling this
     * @returns the id, whether the new one or the existing one
     */
    updateByAssociations(associations: Array<RocketChatAssociationRecord>, data: object, upsert: boolean, appId: string): Promise<string>;
}
