import { BaseBridge } from './BaseBridge';

export abstract class TimersBridge extends BaseBridge {

    public abstract call(nameMethod: string): (callback: (...args: Array<any>) => void, ms: number, ...args: Array<any>) => NodeJS.Timeout;
}
