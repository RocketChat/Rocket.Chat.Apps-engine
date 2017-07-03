import { ICompilerFile } from './interfaces';

import * as fs from 'fs';
import * as path from 'path';
import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';
import * as ts from 'typescript';
import * as vm from 'vm';

export class RocketletCompiler {
    private readonly compilerOptions: ts.CompilerOptions;
    private libraryFiles: { [s: string]: ICompilerFile };

    constructor() {
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
            content: fs.readFileSync(fileName).toString(),
            version: 0,
        };

        return this.libraryFiles[norm];
    }

    public linttTs(source: string): void {
        throw new Error('Not implemented yet.');
    }

    public toJs(source: string): any {
        const files: { [s: string]: ICompilerFile } = {
            'rocketlet.ts': {
                version: 0,
                content: source,
            },
        };

        const host: ts.LanguageServiceHost = {
            getScriptFileNames: () => Object.keys(files),
            getScriptVersion: (fileName) => {
                fileName = path.normalize(fileName);
                return files[fileName] && files[fileName].version.toString();
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
            return {
                success: false,
                others: dia,
            };
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

        const checker = languageService.getProgram().getTypeChecker();
        const src = languageService.getProgram().getSourceFile('rocketlet.ts');
        ts.forEachChild(src, (n) => {
            if (n.kind === ts.SyntaxKind.ClassDeclaration) {
                ts.forEachChild(n, (node) => {
                    if (node.kind === ts.SyntaxKind.HeritageClause) {
                        const e = node as ts.HeritageClause;
                        if (e.token === ts.SyntaxKind.ImplementsKeyword) {
                            console.log('Implements the following:');
                        } else if (e.token === ts.SyntaxKind.ExtendsKeyword) {
                            console.log('Extends the following:');
                        }

                        ts.forEachChild(node, (nn) => {
                            // console.log(ts.SyntaxKind[nn.kind]);
                            console.log(nn.getText());
                        });
                    }
                });
                // console.log(n);
                // const sym = checker.getSymbolAtLocation((n as ts.ClassDeclaration).name);
                // console.log(sym);
            }
        });

        const output = languageService.getEmitOutput('rocketlet.ts');

        if (output.emitSkipped) {
            console.log('Emitting failed...');
            logErrors('rocketlet.ts');
        }

        output.outputFiles.forEach((o) => console.log(o.name, 'output is:', o.text));

        // const result = ts.transpileModule(source, { compilerOptions: this.compilerOptions });

        // TODO: implement the `ts.createProject` so that we get `result.diagnostics`

        // return result.outputText;
        return {
            success: true,
        };
    }

    public toSandBox(js: string): Rocketlet {
        const script = new vm.Script(js);
        const context = vm.createContext({ require, exports });

        const result = script.runInContext(context);

        if (typeof result !== 'function') {
            throw new Error('The provided script is not valid.');
        }

        const rl = new result();

        if (!(rl instanceof Rocketlet)) {
            throw new Error('The script must extend BaseRocketlet.');
        }

        if (typeof rl.getName !== 'function') {
            throw new Error ('The Rocketlet doesn\'t have a `getName` function, this is required.');
        }

        if (typeof rl.getVersion !== 'function') {
            throw new Error ('The Rocketlet doesn\'t have a `getVersion` function, this is required.');
        }

        if (typeof rl.getID !== 'function') {
            throw new Error ('The Rocketlet doesn\'t have a `getID` function, this is required.');
        }

        if (typeof rl.getDescription !== 'function') {
            throw new Error ('The Rocketlet doesn\'t have a `getDescription` function, this is required.');
        }

        if (typeof rl.getRequiredApiVersion !== 'function') {
            throw new Error ('The Rocketlet doesn\'t have a `getRequiredApiVersion` function, this is required.');
        }

        return rl as Rocketlet;
    }
}
