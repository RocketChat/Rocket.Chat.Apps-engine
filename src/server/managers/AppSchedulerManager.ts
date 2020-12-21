import {AppMethod} from '../../definition/metadata';
import {
    IJobContext,
    IOnetimeSchedule,
    IProcessor,
    IRecurringSchedule,
} from '../../definition/scheduler';
import { AppManager } from '../AppManager';
import { IAppSchedulerBridge } from '../bridges/IAppSchedulerBridge';
import { AppAccessorManager } from './';

function createProcessorId(jobId: string, appId: string): string {
    return jobId.includes(`_${appId}`) ? jobId : `${ jobId }_${ appId }`;
}

export class AppSchedulerManager {
    private readonly bridge: IAppSchedulerBridge;
    private readonly accessors: AppAccessorManager;

    private registeredProcessors: Map<string, {[processorId: string]: IProcessor}>;

    constructor(private readonly manager: AppManager) {
        this.bridge = this.manager.getBridges().getSchedulerBridge();
        this.accessors = this.manager.getAccessorManager();
        this.registeredProcessors = new Map();
    }

    public async registerProcessors(processors: Array<IProcessor> = [], appId: string): Promise<void> {
        if (!this.registeredProcessors.get(appId)) {
            this.registeredProcessors.set(appId, {});
        }

        await this.bridge.registerProcessors(processors.map((processor) => {
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

    public async scheduleOnce(job: IOnetimeSchedule, appId: string): Promise<void> {
        this.bridge.scheduleOnce({ ...job, id: createProcessorId(job.id, appId) }, appId);
    }

    public async scheduleRecurring(job: IRecurringSchedule, appId: string): Promise<void> {
        this.bridge.scheduleRecurring({ ...job, id: createProcessorId(job.id, appId) }, appId);
    }

    public async cancelJob(jobId: string, appId: string): Promise<void> {
        this.bridge.cancelJob(createProcessorId(jobId, appId), appId);
    }

    public async cancelAllJobs(appId: string): Promise<void> {
        this.bridge.cancelAllJobs(appId);
    }
}
