export interface IProcessor {
    id: string;
    processor: (data: object) => Promise<void>;
}
