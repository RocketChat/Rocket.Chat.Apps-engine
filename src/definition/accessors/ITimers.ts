export interface ITimers {
    call(nameMethod: string): (callback: (...args: Array<any>) => void, ms: number, ...args: Array<any>) => NodeJS.Timeout;
}
