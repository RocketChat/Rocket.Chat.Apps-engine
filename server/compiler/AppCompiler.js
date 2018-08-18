"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const vm = require("vm");
const errors_1 = require("../errors");
const logging_1 = require("../logging");
const ProxiedApp_1 = require("../ProxiedApp");
const AppImplements_1 = require("./AppImplements");
const App_1 = require("../../definition/App");
const metadata_1 = require("../../definition/metadata");
const Utilities_1 = require("../misc/Utilities");
class AppCompiler {
    constructor() {
        this.compilerOptions = {
            target: ts.ScriptTarget.ES2017,
            module: ts.ModuleKind.CommonJS,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            declaration: false,
            noImplicitAny: false,
            removeComments: true,
            strictNullChecks: true,
            noImplicitReturns: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            // Set this to true if you would like to see the module resolution process
            traceResolution: false,
        };
        this.libraryFiles = {};
    }
    storageFilesToCompiler(files) {
        const result = {};
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
    getLibraryFile(fileName) {
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
    /**
     * Attempts to compile the TypeScript down into JavaScript which we can understand.
     * It returns the files, what the App implements, and whether there are errors or not.
     *
     * @param info the App's information (name, version, etc)
     * @param theFiles the actual files to try and compile
     * @returns the results of trying to compile, including errors
     */
    toJs(info, theFiles) {
        if (!theFiles || !theFiles[info.classFile] || !this.isValidFile(theFiles[info.classFile])) {
            throw new Error(`Invalid App package. Could not find the classFile (${info.classFile}) file.`);
        }
        const result = {
            files: theFiles,
            implemented: new AppImplements_1.AppImplements(),
            compilerErrors: new Array(),
        };
        // Verify all file names are normalized
        // and that the files are valid
        Object.keys(result.files).forEach((key) => {
            if (!this.isValidFile(result.files[key])) {
                throw new Error(`Invalid TypeScript file in the App ${info.name} in the file "${key}".`);
            }
            result.files[key].name = path.normalize(result.files[key].name);
        });
        // Our "current working directory" needs to be adjusted for module resolution
        const cwd = __dirname.includes('node_modules/@rocket.chat/apps-engine')
            ? __dirname.split('node_modules/@rocket.chat/apps-engine')[0] : process.cwd();
        const host = {
            getScriptFileNames: () => Object.keys(result.files),
            getScriptVersion: (fileName) => {
                fileName = path.normalize(fileName);
                const file = result.files[fileName] || this.getLibraryFile(fileName);
                return file && file.version.toString();
            },
            getScriptSnapshot: (fileName) => {
                fileName = path.normalize(fileName);
                const file = result.files[fileName] || this.getLibraryFile(fileName);
                if (!file || !file.content) {
                    return;
                }
                return ts.ScriptSnapshot.fromString(file.content);
            },
            getCompilationSettings: () => this.compilerOptions,
            getCurrentDirectory: () => cwd,
            getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(this.compilerOptions),
            fileExists: (fileName) => {
                return ts.sys.fileExists(fileName);
            },
            readFile: (fileName) => {
                return ts.sys.readFile(fileName);
            },
            resolveModuleNames: (moduleNames, containingFile) => {
                const resolvedModules = new Array();
                // tslint:disable-next-line
                const moduleResHost = { fileExists: host.fileExists, readFile: host.readFile, trace: (traceDetail) => console.log(traceDetail) };
                for (let moduleName of moduleNames) {
                    // Keep compatibility with apps importing apps-ts-definition
                    moduleName = moduleName.replace(/@rocket.chat\/apps-ts-definition\//, '@rocket.chat/apps-engine/definition/');
                    // Let's ensure we search for the App's modules first
                    if (result.files[Utilities_1.Utilities.transformModuleForCustomRequire(moduleName)]) {
                        resolvedModules.push({ resolvedFileName: Utilities_1.Utilities.transformModuleForCustomRequire(moduleName) });
                    }
                    else {
                        // Now, let's try the "standard" resolution but with our little twist on it
                        const rs = ts.resolveModuleName(moduleName, containingFile, this.compilerOptions, moduleResHost);
                        if (rs.resolvedModule) {
                            resolvedModules.push(rs.resolvedModule);
                        }
                    }
                }
                if (moduleNames.length > resolvedModules.length) {
                    const failedCount = moduleNames.length - resolvedModules.length;
                    console.log(`Failed to resolved ${failedCount} modules for ${info.name} v${info.version}!`);
                }
                return resolvedModules;
            },
        };
        const languageService = ts.createLanguageService(host, ts.createDocumentRegistry());
        const coDiag = languageService.getCompilerOptionsDiagnostics();
        if (coDiag.length !== 0) {
            console.log(coDiag);
            console.error('A VERY UNEXPECTED ERROR HAPPENED THAT SHOULD NOT!');
            console.error('Please report this error with a screenshot of the logs. ' +
                `Also, please email a copy of the App being installed/updated: ${info.name} v${info.version} (${info.id})`);
            throw new errors_1.CompilerError(`Language Service's Compiler Options Diagnostics contains ${coDiag.length} diagnostics.`);
        }
        const src = languageService.getProgram().getSourceFile(info.classFile);
        ts.forEachChild(src, (n) => {
            if (n.kind === ts.SyntaxKind.ClassDeclaration) {
                ts.forEachChild(n, (node) => {
                    if (node.kind === ts.SyntaxKind.HeritageClause) {
                        const e = node;
                        ts.forEachChild(node, (nn) => {
                            if (e.token === ts.SyntaxKind.ExtendsKeyword) {
                                if (nn.getText() !== 'App') {
                                    throw new errors_1.MustExtendAppError();
                                }
                            }
                            else if (e.token === ts.SyntaxKind.ImplementsKeyword) {
                                result.implemented.doesImplement(nn.getText());
                            }
                            else {
                                console.log(e.token, nn.getText());
                            }
                        });
                    }
                });
            }
        });
        function logErrors(fileName) {
            const allDiagnostics = languageService.getCompilerOptionsDiagnostics()
                .concat(languageService.getSyntacticDiagnostics(fileName))
                .concat(languageService.getSemanticDiagnostics(fileName));
            allDiagnostics.forEach((diagnostic) => {
                const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                if (diagnostic.file) {
                    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                    console.log(`  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
                }
                else {
                    console.log(`  Error: ${message}`);
                }
            });
        }
        const preEmit = ts.getPreEmitDiagnostics(languageService.getProgram());
        preEmit.forEach((dia) => {
            // Only filter out the typing diagnostics which are something other than errors
            if (dia.category !== ts.DiagnosticCategory.Error) {
                return;
            }
            const msg = ts.flattenDiagnosticMessageText(dia.messageText, '\n');
            if (!dia.file) {
                console.warn(msg);
                return;
            }
            const { line, character } = dia.file.getLineAndCharacterOfPosition(dia.start);
            // console.warn(`  Error ${dia.file.fileName} (${line + 1},${character + 1}): ${msg}`);
            result.compilerErrors.push({
                file: dia.file.fileName,
                line,
                character,
                message: `${dia.file.fileName} (${line + 1},${character + 1}): ${msg}`,
            });
        });
        Object.keys(result.files).forEach((key) => {
            const file = result.files[key];
            const output = languageService.getEmitOutput(file.name);
            if (output.emitSkipped) {
                console.log('Emitting failed for:', file.name);
                logErrors(file.name);
            }
            file.compiled = output.outputFiles[0].text;
        });
        return result;
    }
    toSandBox(manager, storage) {
        const files = this.storageFilesToCompiler(storage.compiled);
        if (typeof files[path.normalize(storage.info.classFile)] === 'undefined') {
            throw new Error(`Invalid App package for "${storage.info.name}". ` +
                `Could not find the classFile (${storage.info.classFile}) file.`);
        }
        const customRequire = Utilities_1.Utilities.buildCustomRequire(files);
        const context = vm.createContext({ require: customRequire, exports, process: {} });
        const script = new vm.Script(files[path.normalize(storage.info.classFile)].compiled);
        const result = script.runInContext(context);
        if (typeof result !== 'function') {
            // tslint:disable-next-line:max-line-length
            throw new Error(`The App's main class for ${storage.info.name} is not valid ("${storage.info.classFile}").`);
        }
        const logger = new logging_1.AppConsole(metadata_1.AppMethod._CONSTRUCTOR);
        const rl = vm.runInNewContext('new App(info, rcLogger);', vm.createContext({
            console: logger,
            rcLogger: logger,
            info: storage.info,
            App: result,
            process: {},
        }), { timeout: 1000, filename: `App_${storage.info.nameSlug}.js` });
        if (!(rl instanceof App_1.App)) {
            throw new errors_1.MustExtendAppError();
        }
        if (typeof rl.getName !== 'function') {
            throw new errors_1.MustContainFunctionError(storage.info.classFile, 'getName');
        }
        if (typeof rl.getNameSlug !== 'function') {
            throw new errors_1.MustContainFunctionError(storage.info.classFile, 'getNameSlug');
        }
        if (typeof rl.getVersion !== 'function') {
            throw new errors_1.MustContainFunctionError(storage.info.classFile, 'getVersion');
        }
        if (typeof rl.getID !== 'function') {
            throw new errors_1.MustContainFunctionError(storage.info.classFile, 'getID');
        }
        if (typeof rl.getDescription !== 'function') {
            throw new errors_1.MustContainFunctionError(storage.info.classFile, 'getDescription');
        }
        if (typeof rl.getRequiredApiVersion !== 'function') {
            throw new errors_1.MustContainFunctionError(storage.info.classFile, 'getRequiredApiVersion');
        }
        const app = new ProxiedApp_1.ProxiedApp(manager, storage, rl, customRequire);
        manager.getLogStorage().storeEntries(app.getID(), logger);
        return app;
    }
    isValidFile(file) {
        if (!file || !file.name || !file.content) {
            return false;
        }
        return file.name.trim() !== ''
            && path.normalize(file.name)
            && file.content.trim() !== '';
    }
}
exports.AppCompiler = AppCompiler;

//# sourceMappingURL=AppCompiler.js.map
