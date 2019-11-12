import * as AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import * as semver from 'semver';
import * as uuidv4 from 'uuid/v4';

import { IAppInfo } from '../../definition/metadata/IAppInfo';
import { RequiredApiVersionError } from '../errors';
import { AppCompiler } from './AppCompiler';
import { IBundleManifest } from './IBundleManifest';
import { ICompilerFile } from './ICompilerFile';
import { ICompilerResult } from './ICompilerResult';
import { IParseAppZipResult } from './IParseAppZipResult';
import { IBundleZipAppEntry, IParseBundleZipResult } from './IParseBundleZipResult';
import { IParseZipResult, ZipContentType } from './IParseZipResult';

export class AppPackageParser {
    // tslint:disable-next-line:max-line-length
    public static uuid4Regex: RegExp = /^[0-9a-fA-f]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    private allowedIconExts: Array<string> = ['.png', '.jpg', '.jpeg', '.gif'];
    private appsEngineVersion: string;

    constructor() {
        this.appsEngineVersion = this.getEngineVersion();
    }

    public parseZip(compiler: AppCompiler, zipContents: Buffer): IParseZipResult {
        const zip = new AdmZip(zipContents);
        const infoZip = zip.getEntry('app.json');
        const bundleManifest = zip.getEntry('manifest.json');

        if (infoZip) {
            return {
                contentType: ZipContentType.APP,
                parsed: this.parseAppZip(compiler, zip, infoZip),
            };
        }

        if (bundleManifest) {
            return {
                contentType: ZipContentType.BUNDLE,
                parsed: this.parseBundleZip(compiler, zip, bundleManifest),
            };
        }

        throw new Error('Invalid zip provided');
    }

    private parseBundleZip(compiler: AppCompiler, zip: AdmZip, bundleManifest: AdmZip.IZipEntry): IParseBundleZipResult {
        let manifest: IBundleManifest;

        if (!bundleManifest.isDirectory) {
            try {
                manifest = JSON.parse(bundleManifest.getData().toString()) as IBundleManifest;
            } catch (error) {
                throw new Error('Invalid bundle manifest file');
            }
        } else {
            throw new Error('Invalid bundle manifest file');
        }

        const apps = manifest.apps.map(({ appId, license, filename }) => {
            const newEntry = { appId, license };
            const entry = zip.getEntry(filename);

            if (!entry || entry.isDirectory) {
                return {
                    ...newEntry,
                    error: `Couldn't find entry from the manifest: ${filename}`,
                };
            }

            let parseResult: IParseZipResult;

            try {
                parseResult = this.parseZip(compiler, entry.getData());
            } catch (error) {
                return {
                    ...newEntry,
                    error: error.message,
                };
            }

            if (parseResult.contentType !== ZipContentType.APP) {
                return {
                    ...newEntry,
                    error: `Entry provided in manifest is not an App: ${filename}`,
                };
            }

            return {
                ...newEntry,
                parseResult: parseResult.parsed,
            } as IBundleZipAppEntry;
        });

        return {
            version: manifest.version,
            workspaceId: manifest.workspaceId,
            apps,
        };
    }

    private parseAppZip(compiler: AppCompiler, zip: AdmZip, infoZip: AdmZip.IZipEntry): IParseAppZipResult {
        let info: IAppInfo;

        if (!infoZip.isDirectory) {
            try {
                info = JSON.parse(infoZip.getData().toString()) as IAppInfo;

                if (!AppPackageParser.uuid4Regex.test(info.id)) {
                    info.id = uuidv4();
                    console.warn('WARNING: We automatically generated a uuid v4 id for',
                        info.name, 'since it did not provide us an id. This is NOT',
                        'recommended as the same App can be installed several times.');
                }
            } catch (e) {
                throw new Error('Invalid App package. The "app.json" file is not valid json.');
            }
        } else {
            throw new Error('Invalid App package. No "app.json" file.');
        }

        if (!semver.satisfies(this.appsEngineVersion, info.requiredApiVersion)) {
            throw new RequiredApiVersionError(info, this.appsEngineVersion);
        }

        // Load all of the TypeScript only files
        let tsFiles: { [s: string]: ICompilerFile } = {};

        zip.getEntries().filter((entry) => entry.entryName.endsWith('.ts') && !entry.isDirectory).forEach((entry) => {
            const norm = path.normalize(entry.entryName);

            // Files which start with `.` are supposed to be hidden
            if (norm.startsWith('.')) {
                return;
            }

            tsFiles[norm] = {
                name: norm,
                content: entry.getData().toString(),
                version: 0,
            };
        });

        // Ensure that the main class file exists
        if (!tsFiles[path.normalize(info.classFile)]) {
            throw new Error(`Invalid App package. Could not find the classFile (${info.classFile}) file.`);
        }

        const languageContent = this.getLanguageContent(zip);

        // Compile all the typescript files to javascript
        let result = {} as ICompilerResult;

        try {
            result = compiler.toJs(info, tsFiles);
            tsFiles = result.files;
        } catch (e) {
            result.compilerErrors = [{
                message: e.message,
                file: '<unknown>',
                line: -1,
                character: -1,
            }];
        }

        const compiledFiles: { [s: string]: string } = {};
        Object.keys(tsFiles).forEach((name) => {
            const norm = path.normalize(name);
            compiledFiles[norm.replace(/\./g, '$')] = tsFiles[norm].compiled;
        });

        // Get the icon's content
        const iconFile = this.getIconFile(zip, info.iconFile);
        if (iconFile) {
            info.iconFileContent = iconFile;
        }

        return {
            info,
            compiledFiles,
            languageContent,
            implemented: result.implemented,
            compilerErrors: result.compilerErrors,
            zipContentsBase64d: zip.toBuffer().toString('base64'),
        };
    }

    private getLanguageContent(zip: AdmZip): { [key: string]: object } {
        const languageContent: { [key: string]: object } = {};

        zip.getEntries().filter((entry) =>
            !entry.isDirectory &&
            entry.entryName.startsWith('i18n/') &&
            entry.entryName.endsWith('.json'))
        .forEach((entry) => {
            const entrySplit = entry.entryName.split('/');
            const lang = entrySplit[entrySplit.length - 1].split('.')[0].toLowerCase();

            let content;
            try {
                content = JSON.parse(entry.getData().toString());
            } catch (e) {
                // Failed to parse it, maybe warn them? idk yet
            }

            languageContent[lang] = Object.assign(languageContent[lang] || {}, content);
        });

        return languageContent;
    }

    private getIconFile(zip: AdmZip, filePath: string): string {
        if (!filePath) {
            return undefined;
        }

        const ext = path.extname(filePath);
        if (!this.allowedIconExts.includes(ext)) {
            return undefined;
        }

        const entry = zip.getEntry(filePath);

        if (!entry) {
            return undefined;
        }

        if (entry.isDirectory) {
            return undefined;
        }

        const base64 = entry.getData().toString('base64');

        return `data:image/${ ext.replace('.', '') };base64,${ base64 }`;
    }

    private getEngineVersion(): string {
        const devLocation = path.join(__dirname, '../../../package.json');
        const prodLocation = path.join(__dirname, '../../package.json');

        let info: { version: string };

        if (fs.existsSync(devLocation)) {
            info = JSON.parse(fs.readFileSync(devLocation, 'utf8'));
        } else if (fs.existsSync(prodLocation)) {
            info = JSON.parse(fs.readFileSync(prodLocation, 'utf8'));
        } else {
            throw new Error('Could not find the Apps TypeScript Definition Package Version!');
        }

        return info.version.replace(/^[^0-9]/, '').split('-')[0];
    }
}
