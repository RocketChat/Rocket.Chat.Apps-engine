import { RocketChatAssociationRecord } from '../../../definition/metadata';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppPersistenceBridge = {
    hasPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.persistence.default)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.persistence.default],
            });
        }
    },
    purge(appId: string): void {
        return this.hasPermission(appId);
    },
    create(data: object, appId: string): void {
        return this.hasPermission(appId);
    },
    createWithAssociations(data: object, associations: Array<RocketChatAssociationRecord>, appId: string): void {
        return this.hasPermission(appId);
    },
    readById(id: string, appId: string): void {
        return this.hasPermission(appId);
    },
    readByAssociations(associations: Array<RocketChatAssociationRecord>, appId: string): void {
        return this.hasPermission(appId);
    },
    remove(id: string, appId: string): void {
        return this.hasPermission(appId);
    },
    removeByAssociations(associations: Array<RocketChatAssociationRecord>, appId: string): void {
        return this.hasPermission(appId);
    },
    update(id: string, data: object, upsert: boolean, appId: string): void {
        return this.hasPermission(appId);
    },
    updateByAssociations(associations: Array<RocketChatAssociationRecord>, data: object, upsert: boolean, appId: string): void {
        return this.hasPermission(appId);
    },
};
