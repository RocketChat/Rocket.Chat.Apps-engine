import { MustContainFunctionError, MustExtendRocketletError } from '../errors';
import { RocketletLoggerManager } from '../managers';
import { ICompilerFile } from './ICompilerFile';

import * as fs from 'fs';
import * as path from 'path';
import { ILogger } from 'temporary-rocketlets-ts-definition/accessors';
import { IRocketlet } from 'temporary-rocketlets-ts-definition/IRocketlet';
import { IRocketletAuthorInfo, IRocketletInfo } from 'temporary-rocketlets-ts-definition/metadata';
import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';
import * as ts from 'typescript';
import * as vm from 'vm';

export class RocketletCompiler {
    private readonly compilerOptions: ts.CompilerOptions;
    private libraryFiles: { [s: string]: ICompilerFile };

    constructor(private readonly logger: RocketletLoggerManager) {
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

    public linttTs(source: string): void {
        throw new Error('Not implemented yet.');
    }

    public toJs(info: IRocketletInfo, files: { [s: string]: ICompilerFile }): { [s: string]: ICompilerFile } {
        if (!files || !files[info.classFile] || !this.isValidFile(files[info.classFile])) {
            throw new Error(`Invalid Rocketlet package. Could not find the classFile (${info.classFile}) file.`);
        }

        // Verify all file names are normalized
        // and that the files are valid
        Object.keys(files).forEach((key) => {
            if (!this.isValidFile(files[key])) {
                throw new Error(`Invalid TypeScript file in the Rocketlet ${info.name} in the file "${key}".`);
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
                                if (nn.getText() !== 'Rocketlet') {
                                    throw new MustExtendRocketletError();
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

    public toSandBox(info: IRocketletInfo, files: { [s: string]: ICompilerFile }): ProxiedRocketlet {
        const customRequire = this.buildCustomRequire(files);
        const context = vm.createContext({ require: customRequire, exports });

        const script = new vm.Script(files[path.normalize(info.classFile)].compiled);
        const result = script.runInContext(context);

        if (typeof result !== 'function') {
            throw new Error(`The Rocketlet's main class for ${info.name} is not valid ("${info.classFile}").`);
        }

        const rl = vm.runInNewContext('new Rocketlet(info, rcLogger);', vm.createContext({
            rcLogger: this.logger.retrieve(info.id),
            info,
            Rocketlet: result,
        }), { timeout: 100, filename: `Rocketlet_${info.nameSlug}.js` });

        if (!(rl instanceof Rocketlet)) {
            throw new MustExtendRocketletError();
        }

        if (typeof rl.getName !== 'function') {
            throw new MustContainFunctionError(info.classFile, 'getName');
        }

        if (typeof rl.getNameSlug !== 'function') {
            throw new MustContainFunctionError(info.classFile, 'getNameSlug');
        }

        if (typeof rl.getVersion !== 'function') {
            throw new MustContainFunctionError(info.classFile, 'getVersion');
        }

        if (typeof rl.getID !== 'function') {
            throw new MustContainFunctionError(info.classFile, 'getID');
        }

        if (typeof rl.getDescription !== 'function') {
            throw new MustContainFunctionError(info.classFile, 'getDescription');
        }

        if (typeof rl.getRequiredApiVersion !== 'function') {
            throw new MustContainFunctionError(info.classFile, 'getRequiredApiVersion');
        }

        return new ProxiedRocketlet(rl as Rocketlet, customRequire);
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
                const context = vm.createContext({ require, exports: ourExport });
                vm.runInContext(files[path.normalize(mod + '.ts')].compiled, context);

                return ourExport;
            } else {
                return require(mod);
            }
        };
    }
}

// tslint:disable-next-line
export class ProxiedRocketlet implements IRocketlet {
    constructor(private readonly rocketlet: Rocketlet, private readonly customRequire: (mod: string) => {}) { }

    public call(method: string, ...args: Array<any>): any {
        const context = vm.createContext({
            rocketlet: this.rocketlet,
            args,
            require: this.customRequire,
        });

        console.log('calling:', method);
        vm.runInContext(`rocketlet.${method}(...args)`, context, { timeout: 100 });
    }

    public getName(): string {
        return this.rocketlet.getName();
    }

    public getNameSlug(): string {
        return this.rocketlet.getNameSlug();
    }

    public getID(): string {
        return this.rocketlet.getID();
    }

    public getVersion(): string {
        return this.rocketlet.getVersion();
    }

    public getDescription(): string {
        return this.rocketlet.getDescription();
    }

    public getRequiredApiVersion(): string {
        return this.rocketlet.getRequiredApiVersion();
    }
    public getAuthorInfo(): IRocketletAuthorInfo {
        return this.rocketlet.getAuthorInfo();
    }

    public getInfo(): IRocketletInfo {
        return this.rocketlet.getInfo();
    }

    public getLogger(): ILogger {
        return this.rocketlet.getLogger();
    }
}
