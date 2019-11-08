import fs from 'fs';
import path from 'path';
import ts from 'typescript';

import { AppCompiler, ICompilerFile } from '../../../src/server/compiler';

test('setupAppCompiler', () => {
    const compiler = new AppCompiler();

    const expectedOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES2017,
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        types: ['node'],
        declaration: false,
        noImplicitAny: false,
        removeComments: true,
        strictNullChecks: true,
        noImplicitReturns: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        traceResolution: false,
    };

    expect((compiler as any).compilerOptions).toEqual(expectedOptions);
});

test('verifyStorageFileToCompiler', () => {
    const compiler = new AppCompiler();

    expect(() => compiler.storageFilesToCompiler({})).not.toThrow();

    const files: { [key: string]: string } = {
        TestingApp$ts: 'act-like-this-is-real',
        TestingAppCommand$ts: 'something-here-as well, yay',
    };

    const expected: { [key: string]: ICompilerFile } = {
        'TestingApp.ts': {
            name: 'TestingApp.ts',
            content: files.TestingApp$ts,
            version: 0,
            compiled: files.TestingApp$ts,
        },
        'TestingAppCommand.ts': {
            name: 'TestingAppCommand.ts',
            content: files.TestingAppCommand$ts,
            version: 0,
            compiled: files.TestingAppCommand$ts,
        },
    };

    expect(compiler.storageFilesToCompiler(files)).toEqual(expected);
});

test('testIsValidFile', () => {
    const compiler = new AppCompiler();

    const invalidNameFile: ICompilerFile = {
        name: ' ',
        content: 'act-like-this-is-real',
        version: 0,
        compiled: 'something-here-as well, yay',
    };

    const invalidContentFile: ICompilerFile = {
        name: 'TestingApp.ts',
        content: ' ',
        version: 0,
        compiled: 'something-here-as well, yay',
    };

    const validFile: ICompilerFile = {
        name: 'TestingApp.ts',
        content: 'act-like-this-is-real',
        version: 0,
        compiled: 'something-here-as well, yay',
    };

    expect((compiler as any).isValidFile()).toBe(false);
    expect((compiler as any).isValidFile({})).toBe(false);
    expect((compiler as any).isValidFile(invalidNameFile)).toBe(false);
    expect((compiler as any).isValidFile(invalidContentFile)).toBe(false);
    expect((compiler as any).isValidFile(validFile)).toBe(true);
});

test('resolvePath', () => {
    const compiler = new AppCompiler();

    const cwd = '/rc/appengine/app/';

    expect(compiler.resolvePath('/rc/appengine/app/index.ts', './index', cwd)).toBe('index.ts');
    expect(compiler.resolvePath('/rc/appengine/app/index.ts', './commands/command', cwd)).toBe('commands/command.ts');
    expect(compiler.resolvePath('/rc/appengine/app/index.ts', './commands/index', cwd)).toBe('commands/index.ts');
    expect(compiler.resolvePath('/rc/appengine/app/index.ts', './utils', cwd)).toBe('utils.ts');

    expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', '../index', cwd)).toBe('index.ts');
    expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', './command', cwd)).toBe('commands/command.ts');
    expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', './index', cwd)).toBe('commands/index.ts');
    expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', '../utils', cwd)).toBe('utils.ts');

    expect(compiler.resolvePath('/rc/appengine/app/index.ts', '../index', cwd)).toBe('index.ts');
    expect(compiler.resolvePath('/rc/appengine/app/index.ts', '.././index', cwd)).toBe('index.ts');
    expect(compiler.resolvePath('/rc/appengine/app/index.ts', './../index', cwd)).toBe('index.ts');

    expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', '../../index', cwd)).toBe('index.ts');
    expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', '../.././index', cwd)).toBe('index.ts');
    expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', './../../index', cwd)).toBe('index.ts');

    expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', '../commands/command', cwd)).toBe('commands/command.ts');
});

test('getLibraryFileMethod', () => {
    const compiler = new AppCompiler();

    const file = __dirname + '/../../test-data/misc/fake-library-file.d.ts';

    const expected: ICompilerFile = {
        name: path.normalize(file),
        version: 0,
        content: fs.readFileSync(file).toString(),
    };

    expect(fs.existsSync(expected.name)).toBe(true);
    expect(compiler.getLibraryFile('doesnt-exist.d.ts')).not.toBeDefined();

    const existSpy = jest.spyOn(fs, 'existsSync');
    const readSpy = jest.spyOn(fs, 'readFileSync');

    expect(compiler.getLibraryFile(file)).toEqual(expected);
    expect(compiler.getLibraryFile(file)).toEqual(expected); // Test again to ensure cache is hit
    expect(compiler.getLibraryFile('thing.ts')).not.toBeDefined();
    expect(fs.existsSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);

    existSpy.mockClear();
    readSpy.mockClear();
});
