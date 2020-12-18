import { RocketChatAssociationRecord } from '../../../definition/metadata';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppPersistenceBridge = {
    hasReadPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.persistence.read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.persistence.read],
            });
        }
    },
    hasWritePermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.persistence.write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.persistence.write],
            });
        }
    },
    purge(appId: string): void {
        return this.hasWritePermission(appId);
    },
    create(data: object, appId: string): void {
        return this.hasWritePermission(appId);
    },
    createWithAssociations(data: object, associations: Array<RocketChatAssociationRecord>, appId: string): void {
        return this.hasWritePermission(appId);
    },
    readById(id: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    readByAssociations(associations: Array<RocketChatAssociationRecord>, appId: string): void {
        return this.hasReadPermission(appId);
    },
    remove(id: string, appId: string): void {
        return this.hasWritePermission(appId);
    },
    removeByAssociation(associations: Array<RocketChatAssociationRecord>, appId: string): void {
        return this.hasWritePermission(appId);
    },
    update(id: string, data: object, upsert: boolean, appId: string): void {
        return this.hasWritePermission(appId);
    },
    updateByAssociation(associations: Array<RocketChatAssociationRecord>, data: object, upsert: boolean, appId: string): void {
        return this.hasWritePermission(appId);
    },
};
