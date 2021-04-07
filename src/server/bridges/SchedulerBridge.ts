import {
    IOnetimeSchedule,
    IProcessor,
    IRecurringSchedule,
} from '../../definition/scheduler';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';

export abstract class SchedulerBridge extends BaseBridge {
    public async doRegisterProcessors(processors: Array<IProcessor> = [], appId: string): Promise<void> {
        this.checDefaultPermission(appId);

        return this.registerProcessors(processors, appId);
    }

    public async doScheduleOnce(job: IOnetimeSchedule, appId: string): Promise<void> {
        this.checDefaultPermission(appId);

        return this.scheduleOnce(job, appId);
    }

    public async doScheduleRecurring(job: IRecurringSchedule, appId: string): Promise<void> {
        this.checDefaultPermission(appId);

        return this.scheduleRecurring(job, appId);
    }

    public async doCancelJob(jobId: string, appId: string): Promise<void> {
        this.checDefaultPermission(appId);

        return this.cancelJob(jobId, appId);
    }

    public async doCancelAllJobs(appId: string): Promise<void> {
        this.checDefaultPermission(appId);

        return this.cancelAllJobs(appId);
    }

    protected abstract registerProcessors(processors: Array<IProcessor>, appId: string): Promise<void>;
    protected abstract scheduleOnce(job: IOnetimeSchedule, appId: string): Promise<void>;
    protected abstract scheduleRecurring(job: IRecurringSchedule, appId: string): Promise<void>;
    protected abstract cancelJob(jobId: string, appId: string): Promise<void>;
    protected abstract cancelAllJobs(appId: string): Promise<void>;

    private checDefaultPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.scheduler.default)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.scheduler.default],
            });
        }
    }

}
