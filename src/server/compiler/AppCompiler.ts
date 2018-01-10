import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import * as vm from 'vm';

import { AppManager } from '../AppManager';
import { MustContainFunctionError, MustExtendAppError } from '../errors';
import { AppConsole } from '../logging/index';
import { ProxiedApp } from '../ProxiedApp';
import { IAppStorageItem } from '../storage/IAppStorageItem';
import { ICompilerFile } from './ICompilerFile';

import { App } from '@rocket.chat/apps-ts-definition/App';
import { AppMethod, IAppInfo } from '@rocket.chat/apps-ts-definition/metadata';

export class AppCompiler {
    private readonly compilerOptions: ts.CompilerOptions;
    private libraryFiles: { [s: string]: ICompilerFile };

    constructor(private readonly manager: AppManager) {
        this.compilerOptions = {
            target: ts.ScriptTarget.ES2016,
            module: ts.ModuleKind.CommonJS,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            declaration: false,
            noImplicitAny: false,
            removeComments: true,
            noImplicitReturns: true,
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
        };

        this.libraryFiles = {};
    }

    public storageFilesToCompiler(files: { [key: string]: string }): { [key: string]: ICompilerFile } {
        const result: { [key: string]: ICompilerFile } = {};

        Object.keys(files).forEach((key) => {
            const name = key.replace(/\$/g, '.');
            result[name] = {
                name,
                content: files[key],
                version: 0,
                compiled: files[key],
            };
        });

        return result;
    }

    public getLibraryFile(fileName: string): ICompilerFile {
        if (!fileName.endsWith('.d.ts')) {
            return undefined;
        }

        const norm = path.normalize(fileName);

        if (this.libraryFiles[norm]) {
            return this.libraryFiles[norm];
        }

        if (!fs.existsSync(fileName)) {
            return undefined;
        }

        this.libraryFiles[norm] = {
            name: norm,
            content: fs.readFileSync(fileName).toString(),
            version: 0,
        };

        return this.libraryFiles[norm];
    }

    public toJs(info: IAppInfo, files: { [s: string]: ICompilerFile }): { [s: string]: ICompilerFile } {
        if (!files || !files[info.classFile] || !this.isValidFile(files[info.classFile])) {
            throw new Error(`Invalid App package. Could not find the classFile (${info.classFile}) file.`);
        }

        // Verify all file names are normalized
        // and that the files are valid
        Object.keys(files).forEach((key) => {
            if (!this.isValidFile(files[key])) {
                throw new Error(`Invalid TypeScript file in the App ${info.name} in the file "${key}".`);
            }

            files[key].name = path.normalize(files[key].name);
        });

        const host: ts.LanguageServiceHost = {
            getScriptFileNames: () => Object.keys(files),
            getScriptVersion: (fileName) => {
                fileName = path.normalize(fileName);
                const file = files[fileName] || this.getLibraryFile(fileName);
                return file && file.version.toString();
            },
            getScriptSnapshot: (fileName) => {
                fileName = path.normalize(fileName);
                const file = files[fileName] || this.getLibraryFile(fileName);

                if (!file || !file.content) {
                    return;
                }

                return ts.ScriptSnapshot.fromString(file.content);
            },
            getCompilationSettings: () => this.compilerOptions,
            getCurrentDirectory: () => process.cwd(),
            getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(this.compilerOptions),
        };

        const languageService = ts.createLanguageService(host, ts.createDocumentRegistry());

        // const dia = languageService.getProgram().getGlobalDiagnostics();
        const dia = languageService.getCompilerOptionsDiagnostics();
        if (dia.length !== 0) {
            console.log(dia);
            throw new Error('The Compiler Options Diagnostics return some values' + ' ' +
                'please report this with a screenshot of above!');
        }

        function logErrors(fileName: string) {
            const allDiagnostics = languageService.getCompilerOptionsDiagnostics()
                .concat(languageService.getSyntacticDiagnostics(fileName))
                .concat(languageService.getSemanticDiagnostics(fileName));

            allDiagnostics.forEach((diagnostic) => {
                const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

                if (diagnostic.file) {
                    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                    console.log(`  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
                } else {
                    console.log(`  Error: ${message}`);
                }
            });
        }

        const src = languageService.getProgram().getSourceFile(info.classFile);
        ts.forEachChild(src, (n) => {
            if (n.kind === ts.SyntaxKind.ClassDeclaration) {
                ts.forEachChild(n, (node) => {
                    if (node.kind === ts.SyntaxKind.HeritageClause) {
                        const e = node as ts.HeritageClause;
                        if (e.token === ts.SyntaxKind.ImplementsKeyword) {
                            console.log('Implements the following:');
                        }

                        ts.forEachChild(node, (nn) => {
                            if (e.token === ts.SyntaxKind.ExtendsKeyword) {
                                if (nn.getText() !== 'App') {
                                    throw new MustExtendAppError();
                                }
                            } else {
                                console.log(nn.getText());
                            }
                        });
                    }
                });
            }
        });

        Object.keys(files).forEach((key) => {
            const file: ICompilerFile = files[key];
            const output: ts.EmitOutput = languageService.getEmitOutput(file.name);

            if (output.emitSkipped) {
                console.log('Emitting failed for:', file.name);
                logErrors(file.name);
            }

            file.compiled = output.outputFiles[0].text;
        });

        return files;
    }

    public toSandBox(storage: IAppStorageItem): ProxiedApp {
        const files = this.storageFilesToCompiler(storage.compiled);

        if (typeof files[path.normalize(storage.info.classFile)] === 'undefined') {
            throw new Error(`Invalid App package for "${storage.info.name}". ` +
                `Could not find the classFile (${storage.info.classFile}) file.`);
        }

        const customRequire = this.buildCustomRequire(files);
        const context = vm.createContext({ require: customRequire, exports, process: {} });

        const script = new vm.Script(files[path.normalize(storage.info.classFile)].compiled);
        const result = script.runInContext(context);

        if (typeof result !== 'function') {
            // tslint:disable-next-line:max-line-length
            throw new Error(`The App's main class for ${storage.info.name} is not valid ("${storage.info.classFile}").`);
        }

        const logger = new AppConsole(AppMethod._CONSTRUCTOR);
        const rl = vm.runInNewContext('new App(info, rcLogger);', vm.createContext({
            console: logger,
            rcLogger: logger,
            info: storage.info,
            App: result,
            process: {},
        }), { timeout: 100, filename: `App_${storage.info.nameSlug}.js` });

        if (!(rl instanceof App)) {
            throw new MustExtendAppError();
        }

        if (typeof rl.getName !== 'function') {
            throw new MustContainFunctionError(storage.info.classFile, 'getName');
        }

        if (typeof rl.getNameSlug !== 'function') {
            throw new MustContainFunctionError(storage.info.classFile, 'getNameSlug');
        }

        if (typeof rl.getVersion !== 'function') {
            throw new MustContainFunctionError(storage.info.classFile, 'getVersion');
        }

        if (typeof rl.getID !== 'function') {
            throw new MustContainFunctionError(storage.info.classFile, 'getID');
        }

        if (typeof rl.getDescription !== 'function') {
            throw new MustContainFunctionError(storage.info.classFile, 'getDescription');
        }

        if (typeof rl.getRequiredApiVersion !== 'function') {
            throw new MustContainFunctionError(storage.info.classFile, 'getRequiredApiVersion');
        }

        const app = new ProxiedApp(this.manager, storage, rl as App, customRequire);

        this.manager.getLogStorage().storeEntries(app.getID(), logger);

        return app;
    }

    private isValidFile(file: ICompilerFile): boolean {
        return file.name
            && file.name.trim() !== ''
            && path.normalize(file.name)
            && file.content
            && file.content.trim() !== '';
    }

    private buildCustomRequire(files: { [s: string]: ICompilerFile }): (mod: string) => {} {
        return function _requirer(mod: string): any {
            if (files[path.normalize(mod + '.ts')]) {
                const ourExport = {};
                const context = vm.createContext({ require, exports: ourExport, process: {} });
                vm.runInContext(files[path.normalize(mod + '.ts')].compiled, context);

                return ourExport;
            } else {
                return require(mod);
            }
        };
    }
}
