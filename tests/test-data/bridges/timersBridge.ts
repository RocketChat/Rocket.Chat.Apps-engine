import { TimersBridge } from '../../../src/server/bridges/TimersBridge';

export class TestsTimersBridge extends TimersBridge {
    public call(nameMethod: string): (callback: (...args: Array<any>) => void, ms: number, ...args: Array<any>) => NodeJS.Timeout {
        throw new Error('Method not implemented.');
    }
}
