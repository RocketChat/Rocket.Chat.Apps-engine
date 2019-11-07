// import * as stackTrace from 'stack-trace';
import { ILogEntry, LogMessageSeverity } from '../../../src/definition/accessors';
import { AppMethod } from '../../../src/definition/metadata';

import { AppConsole } from '../../../src/server/logging';

test('basicConsoleMethods', () => {
    expect(() => new AppConsole(AppMethod._CONSTRUCTOR)).not.toThrow();

    const logger = new AppConsole(AppMethod._CONSTRUCTOR);
    const entries: Array<ILogEntry> = (logger as any).entries;

    expect(() => logger.debug('this is a debug')).not.toThrow();
    expect(entries.length).toBe(1);
    expect(entries[0].severity).toBe(LogMessageSeverity.DEBUG);
    expect(entries[0].args[0]).toBe('this is a debug');

    expect(() => logger.info('this is an info log')).not.toThrow();
    expect(entries.length).toBe(2);
    expect(entries[1].severity).toBe(LogMessageSeverity.INFORMATION);
    expect(entries[1].args[0]).toBe('this is an info log');

    expect(() => logger.log('this is a log')).not.toThrow();
    expect(entries.length).toBe(3);
    expect(entries[2].severity).toBe(LogMessageSeverity.LOG);
    expect(entries[2].args[0]).toBe('this is a log');

    expect(() => logger.warn('this is a warn')).not.toThrow();
    expect(entries.length).toBe(4);
    expect(entries[3].severity).toBe(LogMessageSeverity.WARNING);
    expect(entries[3].args[0]).toBe('this is a warn');

    const e = new Error('just a test');
    expect(() => logger.error(e)).not.toThrow();
    expect(entries.length).toBe(5);
    expect(entries[4].severity).toBe(LogMessageSeverity.ERROR);
    expect(entries[4].args[0]).toBe(JSON.stringify(e, Object.getOwnPropertyNames(e)));

    expect(() => logger.success('this is a success')).not.toThrow();
    expect(entries.length).toBe(6);
    expect(entries[5].severity).toBe(LogMessageSeverity.SUCCESS);
    expect(entries[5].args[0]).toBe('this is a success');

    expect(() => {
        class Item {
            constructor() {
                logger.debug('inside');
            }
        }

        return new Item();
    }).not.toThrow();

    expect(logger.getEntries()).toEqual(entries);
    expect(logger.getMethod()).toBe(AppMethod._CONSTRUCTOR);
    expect(logger.getStartTime()).toBeDefined();
    expect(logger.getEndTime()).toBeDefined();
    expect(logger.getTotalTime()).toBeGreaterThan(1);

    // const getFuncSpy = jest.spyOn<any, any>(logger, 'getFunc');
    // expect(getFuncSpy.call([{} as stackTrace.StackFrame])).toBe('anonymous');
    // const mockFrames = new Array<stackTrace.StackFrame>();
    // mockFrames.push({} as stackTrace.StackFrame);
    // mockFrames.push({
    //     getMethodName() {
    //         return 'testing';
    //     },
    //     getFunctionName() {
    //         return null;
    //     },
    // } as stackTrace.StackFrame);
    // expect(getFuncSpy.call(mockFrames)).toBe('testing');

    expect(AppConsole.toStorageEntry('testing-app', logger)).toBeDefined(); // TODO: better test this
});
