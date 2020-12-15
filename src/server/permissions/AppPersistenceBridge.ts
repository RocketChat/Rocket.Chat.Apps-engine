import { RocketChatAssociationRecord } from '../../definition/metadata';
import { IPermission } from '../../definition/permission/IPermission';

export const PersistencePermissions: { [permission: string]: IPermission } = {
    // getById, getByName, getCreatorById, getCreatorByName, getDirectByUsernames, getMembers
    general: {
        name: 'persistence.general',
    },
};

export const AppPersistenceBridge = {
    purge(appId: string): void {
        return;
    },
    create(data: object, appId: string): void {
        return;
    },
    createWithAssociations(data: object, associations: Array<RocketChatAssociationRecord>, appId: string): void {
        return;
    },
    readById(id: string, appId: string): void {
        return;
    },
    readByAssociations(associations: Array<RocketChatAssociationRecord>, appId: string): void {
        return;
    },
    remove(id: string, appId: string): void {
        return;
    },
    removeByAssociation(associations: Array<RocketChatAssociationRecord>, appId: string): void {
        return;
    },
    update(id: string, data: object, upsert: boolean, appId: string): void {
        return;
    },
    updateByAssociation(associations: Array<RocketChatAssociationRecord>, data: object, upsert: boolean, appId: string): void {
        return;
    },
};
