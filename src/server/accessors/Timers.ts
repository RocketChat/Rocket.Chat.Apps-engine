import { ITimers } from '../../definition/accessors/ITimers';
import { AppBridges } from '../bridges/AppBridges';

export class Timers implements ITimers {
    constructor(private readonly bridges: AppBridges) { }
    public call(nameMethod: string): (callback: (...args: Array<any>) => void, ms: number, ...args: Array<any>) => NodeJS.Timeout {
        return this.bridges.getTimersBridge().call(nameMethod);
    }
}
