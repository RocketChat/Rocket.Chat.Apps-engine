// tslint:disable:max-classes-per-file

import { Expect, SetupFixture, SpyOn, Test } from 'alsatian';
import * as stackTrace from 'stack-trace';
import { ILogEntry, LogMessageSeverity } from '../../../src/definition/accessors';
import { AppMethod } from '../../../src/definition/metadata';
import { AppManager } from '../../../src/server/AppManager';
import { AppBridges, IInternalBridge } from '../../../src/server/bridges';

import { AppConsole } from '../../../src/server/logging';
import { TestsAppBridges } from '../../test-data/bridges/appBridges';

export class AppConsoleTestFixture {

    private mockManager: AppManager;
    private mockBridges: AppBridges;
    private mockInternalBridge: IInternalBridge;

    @SetupFixture
    public setupFixture() {
        this.mockBridges = new TestsAppBridges();

        const bridges = this.mockBridges;

        this.mockInternalBridge = {
            isDevelopmentModeEnabled() {
                return true;
            },
        } as IInternalBridge;

        bridges.getInternalBridge = () => this.mockInternalBridge;

        this.mockManager = {
            getBridges() {
                return bridges;
            },
        } as AppManager;
    }

    @Test()
    public basicConsoleMethods() {
        Expect(() => new AppConsole(AppMethod._CONSTRUCTOR, this.mockManager)).not.toThrow();

        const logger = new AppConsole(AppMethod._CONSTRUCTOR, this.mockManager);
        const entries: Array<ILogEntry> = (logger as any).entries;

        Expect(() => logger.debug('this is a debug')).not.toThrow();
        Expect(entries.length).toBe(1);
        Expect(entries[0].severity).toBe(LogMessageSeverity.DEBUG);
        Expect(entries[0].args[0]).toBe('this is a debug');

        Expect(() => logger.info('this is an info log')).not.toThrow();
        Expect(entries.length).toBe(2);
        Expect(entries[1].severity).toBe(LogMessageSeverity.INFORMATION);
        Expect(entries[1].args[0]).toBe('this is an info log');

        Expect(() => logger.log('this is a log')).not.toThrow();
        Expect(entries.length).toBe(3);
        Expect(entries[2].severity).toBe(LogMessageSeverity.LOG);
        Expect(entries[2].args[0]).toBe('this is a log');

        Expect(() => logger.warn('this is a warn')).not.toThrow();
        Expect(entries.length).toBe(4);
        Expect(entries[3].severity).toBe(LogMessageSeverity.WARNING);
        Expect(entries[3].args[0]).toBe('this is a warn');

        const e = new Error('just a test');
        Expect(() => logger.error(e)).not.toThrow();
        Expect(entries.length).toBe(5);
        Expect(entries[4].severity).toBe(LogMessageSeverity.ERROR);
        Expect(entries[4].args[0]).toBe(JSON.stringify(e, Object.getOwnPropertyNames(e)));

        Expect(() => logger.success('this is a success')).not.toThrow();
        Expect(entries.length).toBe(6);
        Expect(entries[5].severity).toBe(LogMessageSeverity.SUCCESS);
        Expect(entries[5].args[0]).toBe('this is a success');

        Expect(() => {
            class Item {
                constructor() {
                    logger.debug('inside');
                }
            }

            return new Item();
        }).not.toThrow();

        Expect(logger.getEntries()).toEqual(entries);
        Expect(logger.getMethod()).toBe(AppMethod._CONSTRUCTOR);
        Expect(logger.getStartTime()).toBeDefined();
        Expect(logger.getEndTime()).toBeDefined();
        Expect(logger.getTotalTime()).toBeGreaterThan(1);

        const getFuncSpy = SpyOn(logger, 'getFunc');
        Expect(getFuncSpy.call([{} as stackTrace.StackFrame])).toBe('anonymous');
        const mockFrames = new Array<stackTrace.StackFrame>();
        mockFrames.push({} as stackTrace.StackFrame);
        mockFrames.push({
            getMethodName() {
                return 'testing';
            },
            getFunctionName() {
                return null;
            },
        } as stackTrace.StackFrame);
        Expect(getFuncSpy.call(mockFrames)).toBe('testing');

        Expect(AppConsole.toStorageEntry('testing-app', logger)).toBeDefined(); // TODO: better test this
    }
}
