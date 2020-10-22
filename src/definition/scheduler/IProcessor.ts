export interface IProcessor {
    name: string;
    processor: (data: object) => Promise<void>;
}
