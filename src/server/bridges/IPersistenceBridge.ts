import { RocketChatAssociationRecord } from 'temporary-rocketlets-ts-definition/metadata';

export interface IPersistenceBridge {
    /**
     * Purges the Rocketlet's persistant storage data from the persistent storage.
     *
     * @argument rocketletId the id of the rocketlet's data to remove
     */
    purge(rocketletId: string): void;

    /**
     * Creates a new persistant record with the provided data attached.
     *
     * @argument data the data to store in persistent storage
     * @argument rocketletId the id of the rocketlet which is storing the data
     * @returns the id of the stored record
     */
    create(data: any, rocketletId: string): string;

    /**
     * Creates a new record in the Rocketlet's persistent storage with the data being
     * associated with at least one Rocket.Chat record.
     *
     * @argument data the data to store in the persistent storage
     * @argument associations the associations records this data is associated with
     * @argument rocketletId the id of the rocketlet which is storing the data
     * @returns the id of the stored record
     */
    createWithAssociations(data: object, associations: Array<RocketChatAssociationRecord>, rocketletId: string): string;

    /**
     * Retrieves from the persistent storage the record by the id provided.
     *
     * @argument id the record id to read
     * @argument rocketletId the id of the rocketlet calling this
     * @returns the data stored in the persistent storage, or undefined
     */
    readById(id: string, rocketletId: string): object;

    /**
     * Retrieves the data which is associated with the provided records.
     *
     * @argument associations the association records to query about
     * @argument rocketletId the id of the rocketlet calling this
     * @returns an array of records if they exist, an empty array otherwise
     */
    readByAssociations(associations: Array<RocketChatAssociationRecord>, rocketletId: string): Array<object>;

    /**
     * Removes the record which matches the provided id.
     *
     * @argument id the id of the record
     * @argument rocketletId the id of the rocketlet calling this
     * @returns the data being removed
     */
    remove(id: string, rocketletId: string): object;

    /**
     * Removes any data which has been associated with the provided records.
     *
     * @argument associations the associations which to remove records
     * @argument rocketletId the id of the rocketlet calling this
     * @returns the amount of records removed
     */
    removeByAssociations(associations: Array<RocketChatAssociationRecord>, rocketletId: string): number;

    /**
     * Updates the record in the database, with the option of creating a new one if it doesn't exist.
     *
     * @argument id the id of the record to update
     * @argument data the updated data to set in the record
     * @argument upsert whether to create if the id doesn't exist
     * @argument rocketletId the id of the rocketlet calling this
     * @returns the id, whether the new one or the existing one
     */
    update(id: string, data: object, upsert: boolean, rocketletId: string): string;
}
