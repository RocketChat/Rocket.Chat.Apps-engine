import { RocketletManager } from '../RocketletManager';
import { ICompilerFile } from './ICompilerFile';
import { IParseZipResult } from './IParseZipResult';

import * as AdmZip from 'adm-zip';
import * as path from 'path';
import { IRocketletInfo } from 'temporary-rocketlets-ts-definition/metadata/IRocketletInfo';
import * as uuidv4 from 'uuid/v4';

export class RocketletPackageParser {
    // tslint:disable-next-line:max-line-length
    public static uuid4Regex: RegExp = /^[0-9a-fA-f]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    constructor(private readonly manager: RocketletManager) {}

    public async parseZip(zipBase64: string): Promise<IParseZipResult> {
        const zip = new AdmZip(new Buffer(zipBase64, 'base64'));
        const infoZip = zip.getEntry('rocketlet.json');
        let info: IRocketletInfo;

        if (infoZip && !infoZip.isDirectory) {
            try {
                info = JSON.parse(infoZip.getData().toString()) as IRocketletInfo;

                if (!RocketletPackageParser.uuid4Regex.test(info.id)) {
                    info.id = uuidv4();
                    console.warn('WARNING: We automatically generated a uuid v4 id for',
                        info.name, 'since it did not provide us an id. This is NOT',
                        'recommended as the same Rocketlet can be installed several times.');
                }
            } catch (e) {
                throw new Error('Invalid Rocketlet package. The "rocketlet.json" file is not valid json.');
            }
        } else {
            throw new Error('Invalid Rocketlet package. No "rocketlet.json" file.');
        }

        // Load all of the TypeScript only files
        const tsFiles: { [s: string]: ICompilerFile } = {};

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
            throw new Error(`Invalid Rocketlet package. Could not find the classFile (${info.classFile}) file.`);
        }

        // TODO: Assign this to something
        const languageFiles = this.getLanguageFiles(zip);

        // Compile all the typescript files to javascript
        // this actually modifies the `tsFiles` object
        this.manager.getCompiler().toJs(info, tsFiles);

        // Now that is has all been compiled, let's get the
        // the Rocketlet instance from the source.
        const rocketlet = this.manager.getCompiler().toSandBox(info, tsFiles);

        const compiledFiles: { [s: string]: string } = {};
        Object.keys(tsFiles).forEach((name) => {
            const norm = path.normalize(name);
            compiledFiles[norm.replace(/\./g, '$')] = tsFiles[norm].compiled;
        });

        return {
            info,
            compiledFiles,
            languageFiles,
            rocketlet,
        };
    }

    private getLanguageFiles(zip: AdmZip): { [key: string]: string } {
        const languageFiles: { [key: string]: string } = {};

        zip.getEntries().filter((entry) =>
            !entry.isDirectory &&
            entry.entryName.startsWith('i18n/') &&
            entry.entryName.endsWith('.json'))
        .forEach((entry) => {
            languageFiles[entry.entryName] = entry.getData().toString();
        });

        return languageFiles;
    }
}
