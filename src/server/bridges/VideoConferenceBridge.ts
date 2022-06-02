import type { VideoConference } from '../../definition/videoConferences/VideoConference';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';

export abstract class VideoConferenceBridge extends BaseBridge {
    public async doGetById(callId: string, appId: string): Promise<VideoConference> {
        if (this.hasReadPermission(appId)) {
            return this.getById(callId, appId);
        }
    }

    protected abstract getById(callId: string, appId: string): Promise<VideoConference>;

    private hasReadPermission(appId: string): boolean {
        if (AppPermissionManager.hasPermission(appId, AppPermissions.videoConference.read)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(new PermissionDeniedError({
            appId,
            missingPermissions: [AppPermissions.videoConference.read],
        }));

        return false;
    }
}
