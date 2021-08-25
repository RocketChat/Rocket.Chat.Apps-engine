import {Expect, SetupFixture, SpyOn, Test} from 'alsatian';

import { Timers } from '../../../src/server/accessors';
import { AppBridges, TimersBridge } from '../../../src/server/bridges';

export class TimersAccessorsTestFixture {
    private mockAppBridge: AppBridges;
    private mockTimersBridge: TimersBridge;
    private mockTimeout: NodeJS.Timeout;

    @SetupFixture
    public setupFixture() {
        const timeout = this.mockTimeout as NodeJS.Timeout;
        this.mockTimersBridge = {
            call(nameMethod: string): (callback: (...args: Array<any>) => void, ms: number, ...args: Array<any>) => NodeJS.Timeout {
                return (callback: (...args: Array<any>) => void, ms: number, ...args: Array<any>) => timeout;
            },
        } as TimersBridge;

        const timersBridge = this.mockTimersBridge;
        this.mockAppBridge = { getTimersBridge(): TimersBridge {
                return timersBridge;
            },
        } as AppBridges;
    }

    @Test()
    public useTimers() {
        Expect(() => new Timers(this.mockAppBridge)).not.toThrow();

        const timers = new Timers(this.mockAppBridge);
        Expect(timers.call('nameMethod')).toBeDefined();

        SpyOn(this.mockTimersBridge, 'call');
        SpyOn(timers, 'call');
    }
}
