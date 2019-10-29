import { Expect, SpyOn, Test } from 'alsatian';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

import { AppCompiler, ICompilerFile } from '../../../src/server/compiler';

export class AppCompilerTestFixture {
    @Test()
    public setupAppCompiler() {
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

        Expect((compiler as any).compilerOptions).toEqual(expectedOptions);
    }

    @Test()
    public verifyStorageFileToCompiler() {
        const compiler = new AppCompiler();

        Expect(() => compiler.storageFilesToCompiler({})).not.toThrow();

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

        Expect(compiler.storageFilesToCompiler(files)).toEqual(expected);
    }

    @Test()
    public testIsValidFile() {
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

        Expect((compiler as any).isValidFile()).toBe(false);
        Expect((compiler as any).isValidFile({})).toBe(false);
        Expect((compiler as any).isValidFile(invalidNameFile)).toBe(false);
        Expect((compiler as any).isValidFile(invalidContentFile)).toBe(false);
        Expect((compiler as any).isValidFile(validFile)).toBe(true);
    }

    @Test()
    public resolvePath() {
        const compiler = new AppCompiler();

        const cwd = '/rc/appengine/app/';

        Expect(compiler.resolvePath('/rc/appengine/app/index.ts', './index', cwd)).toBe('index.ts');
        Expect(compiler.resolvePath('/rc/appengine/app/index.ts', './commands/command', cwd)).toBe('commands/command.ts');
        Expect(compiler.resolvePath('/rc/appengine/app/index.ts', './commands/index', cwd)).toBe('commands/index.ts');
        Expect(compiler.resolvePath('/rc/appengine/app/index.ts', './utils', cwd)).toBe('utils.ts');

        Expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', '../index', cwd)).toBe('index.ts');
        Expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', './command', cwd)).toBe('commands/command.ts');
        Expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', './index', cwd)).toBe('commands/index.ts');
        Expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', '../utils', cwd)).toBe('utils.ts');

        Expect(compiler.resolvePath('/rc/appengine/app/index.ts', '../index', cwd)).toBe('index.ts');
        Expect(compiler.resolvePath('/rc/appengine/app/index.ts', '.././index', cwd)).toBe('index.ts');
        Expect(compiler.resolvePath('/rc/appengine/app/index.ts', './../index', cwd)).toBe('index.ts');

        Expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', '../../index', cwd)).toBe('index.ts');
        Expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', '../.././index', cwd)).toBe('index.ts');
        Expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', './../../index', cwd)).toBe('index.ts');

        Expect(compiler.resolvePath('/rc/appengine/app/commands/index.ts', '../commands/command', cwd)).toBe('commands/command.ts');
    }

    @Test()
    public getLibraryFileMethod() {
        const compiler = new AppCompiler();

        const file = __dirname + '/../../test-data/misc/fake-library-file.d.ts';

        const expected: ICompilerFile = {
            name: path.normalize(file),
            version: 0,
            content: fs.readFileSync(file).toString(),
        };

        Expect(fs.existsSync(expected.name)).toBe(true);
        Expect(compiler.getLibraryFile('doesnt-exist.d.ts')).not.toBeDefined();

        const existSpy = SpyOn(fs, 'existsSync');
        const readSpy = SpyOn(fs, 'readFileSync');

        Expect(compiler.getLibraryFile(file)).toEqual(expected);
        Expect(compiler.getLibraryFile(file)).toEqual(expected); // Test again to ensure cache is hit
        Expect(compiler.getLibraryFile('thing.ts')).not.toBeDefined();
        Expect(fs.existsSync).toHaveBeenCalled().exactly(1);
        Expect(fs.readFileSync).toHaveBeenCalled().exactly(1);

        existSpy.restore();
        readSpy.restore();
    }
}
