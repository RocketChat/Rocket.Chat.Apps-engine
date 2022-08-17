import { AppStatus } from '../../definition/AppStatus';
import { AppMethod } from '../../definition/metadata';
import {
    IJobContext,
    IOnetimeSchedule,
    IProcessor,
    IRecurringSchedule,
} from '../../definition/scheduler';
import { AppManager } from '../AppManager';
import { IInternalSchedulerBridge } from '../bridges/IInternalSchedulerBridge';
import { SchedulerBridge } from '../bridges/SchedulerBridge';
import { AppAccessorManager } from './';

function createProcessorId(jobId: string, appId: string): string {
    return jobId.includes(`_${appId}`) ? jobId : `${ jobId }_${ appId }`;
}

export class AppSchedulerManager {
    private readonly bridge: SchedulerBridge;
    private readonly accessors: AppAccessorManager;

    private registeredProcessors: Map<string, {[processorId: string]: IProcessor}>;

    constructor(private readonly manager: AppManager) {
        this.bridge = this.manager.getBridges().getSchedulerBridge();
        this.accessors = this.manager.getAccessorManager();
        this.registeredProcessors = new Map();
    }

    public async registerProcessors(processors: Array<IProcessor> = [], appId: string): Promise<void | Array<string>> {
        if (!this.registeredProcessors.get(appId)) {
            this.registeredProcessors.set(appId, {});
        }

        return this.bridge.doRegisterProcessors(processors.map((processor) => {
            const processorId = createProcessorId(processor.id, appId);

            this.registeredProcessors.get(appId)[processorId] = processor;

            return {
                id: processorId,
                processor: this.wrapProcessor(appId, processorId).bind(this),
                startupSetting: processor.startupSetting,
            };
        }),  appId);
    }

    public wrapProcessor(appId: string, processorId: string): IProcessor['processor'] {
        return async (jobContext: IJobContext) => {
            const processor = this.registeredProcessors.get(appId)[processorId];

            if (!processor) {
                throw new Error(`Processor ${processorId} not available`);
            }

            const app = this.manager.getOneById(appId);
            const status = app.getStatus();
            const previousStatus = app.getPreviousStatus();

            const isNotToRunJob = this.isNotToRunJob(status, previousStatus);

            if (isNotToRunJob) {
                return;
            }

            const context = app.makeContext({
                processor,
                args: [
                    jobContext,
                    this.accessors.getReader(appId),
                    this.accessors.getModifier(appId),
                    this.accessors.getHttp(appId),
                    this.accessors.getPersistence(appId),
                ],
            });

            const logger = app.setupLogger(AppMethod._JOB_PROCESSOR);
            logger.debug(`Job processor ${processor.id} is being executed...`);

            try {
                const codeToRun = `processor.processor.apply(null, args)`;
                await app.runInContext(codeToRun, context);
                logger.debug(`Job processor ${processor.id} was sucessfully executed`);
            } catch (e) {
                logger.error(e);
                logger.debug(`Job processor ${processor.id} was unsuccessful`);

                throw e;
            } finally {
                await this.manager.getLogStorage().storeEntries(appId, logger);
            }
        };
    }

    public async scheduleOnce(job: IOnetimeSchedule, appId: string): Promise<void | string> {
        return this.bridge.doScheduleOnce({ ...job, id: createProcessorId(job.id, appId) }, appId);
    }

    public async scheduleRecurring(job: IRecurringSchedule, appId: string): Promise<void | string> {
        return this.bridge.doScheduleRecurring({ ...job, id: createProcessorId(job.id, appId) }, appId);
    }

    public async cancelJob(jobId: string, appId: string): Promise<void> {
        this.bridge.doCancelJob(createProcessorId(jobId, appId), appId);
    }

    public async cancelAllJobs(appId: string): Promise<void> {
        this.bridge.doCancelAllJobs(appId);
    }

    public async cleanUp(appId: string): Promise<void> {
        (this.bridge as IInternalSchedulerBridge & SchedulerBridge).cancelAllJobs(appId);
    }

    private isNotToRunJob(status: AppStatus, previousStatus: AppStatus): boolean {
        const isAppCurrentDisabled = status === AppStatus.DISABLED || status === AppStatus.MANUALLY_DISABLED;
        const wasAppDisabled = previousStatus === AppStatus.DISABLED || previousStatus === AppStatus.MANUALLY_DISABLED;

        return (status === AppStatus.INITIALIZED && wasAppDisabled) || isAppCurrentDisabled;
    }
}
