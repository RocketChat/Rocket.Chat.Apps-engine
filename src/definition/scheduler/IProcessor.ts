export interface IProcessor {
    id: string;
    processor: (job: IJob) => Promise<void>;
}

interface IJob {
    [key: string]: any;
}
