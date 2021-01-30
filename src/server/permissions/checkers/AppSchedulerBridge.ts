import { IOnetimeSchedule, IProcessor, IRecurringSchedule } from '../../../definition/scheduler';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppSchedulerBridge = {
    hasGeneralPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.scheduler.default)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.scheduler.default],
            });
        }
    },
    registerProcessors(processor: Array<IProcessor>, appId: string): void {
        return this.hasGeneralPermission(appId);
    },
    scheduleOnce(job: IOnetimeSchedule, appId: string): void {
        return this.hasGeneralPermission(appId);
    },
    scheduleRecurring(job: IRecurringSchedule, appId: string): void {
        return this.hasGeneralPermission(appId);
    },
    cancelJob(jobId: string, appId: string): void {
        return this.hasGeneralPermission(appId);
    },
    cancelAllJobs(appId: string): void { },
};
