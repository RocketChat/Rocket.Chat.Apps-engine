import { RocketletCompiler } from './compiler';
import { ICompilerFile, IGetRocketletsFilter, IParseZipResult } from './interfaces';
import { RocketletLoggerManager } from './logger';
import { IRocketletStorageItem, RocketletStorage } from './storage';

import * as AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import { IRocketletInfo } from 'temporary-rocketlets-ts-definition/metadata';
import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';
import * as ts from 'typescript';
import * as uuidv4 from 'uuid/v4';
import * as vm from 'vm';

export class RocketletManager {
    // tslint:disable-next-line
    private static uuid4Regex: RegExp = /^[0-9a-fA-f]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    private readonly availableRocketlets: Map<string, Rocketlet>;
    private readonly activeRocketlets: Map<string, Rocketlet>;
    private readonly inactiveRocketlets: Map<string, Rocketlet>;
    private readonly storage: RocketletStorage;
    private readonly logger: RocketletLoggerManager;
    private readonly compiler: RocketletCompiler;

    constructor(rlStorage: RocketletStorage) {
        this.availableRocketlets = new Map<string, Rocketlet>();
        this.activeRocketlets = new Map<string, Rocketlet>();
        this.inactiveRocketlets = new Map<string, Rocketlet>();
        this.logger = new RocketletLoggerManager();

        if (rlStorage instanceof RocketletStorage) {
            this.storage = rlStorage;
        } else {
            throw new Error('Invalid instance of the RocketletStorage.');
        }

        this.compiler = new RocketletCompiler(this.logger);
        console.log('Constructed the RocketletManager.');
    }

    public getCompiler(): RocketletCompiler {
        return this.compiler;
    }

    public async load(): Promise<Array<Rocketlet>> {
        const items = await this.storage.retrieveAll();
        const rcs = items.map((item: IRocketletStorageItem) => {
            const files: { [key: string]: ICompilerFile} = {};
            Object.keys(item.compiled).forEach((key) => {
                const name = key.replace(/\$/g, '.');
                files[name] = {
                    name,
                    content: item.compiled[key],
                    version: 0,
                    compiled: item.compiled[key],
                };
            });

            return this.getCompiler().toSandBox(item.info, files);
        });

        return rcs.map((rc: Rocketlet) => {
            this.availableRocketlets.set(rc.getID(), rc);
            return rc;
        });
    }

    public async loadOne(id: string): Promise<Rocketlet> {
        throw new Error('Not implemented yet.');
    }

    public get(filter?: IGetRocketletsFilter): Array<Rocketlet> {
        if (filter) {
            console.warn('The filter is not yet implemented.');
        }

        const rls = new Array<Rocketlet>();
        this.availableRocketlets.forEach((rc, id) => rls.push(rc));

        return rls;
    }

    public enable(id: string): boolean {
        throw new Error('Not implemented yet.');
    }

    public disable(id: string): boolean {
        throw new Error('Not implemented yet.');
    }

    public async add(zipContentsBase64d: string): Promise<Rocketlet> {
        const result = await this.parseZip(zipContentsBase64d);
        const created = await this.storage.create({
            id: result.info.id,
            info: result.info,
            zip: zipContentsBase64d,
            compiled: result.compiledFiles,
        });

        if (!created) {
            throw new Error('Failed to create the Rocketlet, the storage did not return it.');
        }

        this.availableRocketlets.set(result.info.id, result.rocketlet);
        return result.rocketlet;
    }

    public async update(zipContentsBase64d: string): Promise<Rocketlet> {
        const result = await this.parseZip(zipContentsBase64d);
        const old = await this.storage.retrieveOne(result.info.id);

        if (!old) {
            throw new Error('Can not update a Rocketlet that does not currently exist.');
        }

        const stored = await this.storage.update({
            id: result.info.id,
            info: result.info,
            zip: zipContentsBase64d,
            compiled: result.compiledFiles,
        });

        this.availableRocketlets.set(stored.id, result.rocketlet);
        return result.rocketlet;
    }

    public remove(id: string): Rocketlet {
        throw new Error('Not implemented nor architected.');
    }

    private async parseZip(zipBase64: string): Promise<IParseZipResult> {
        const zip = new AdmZip(new Buffer(zipBase64, 'base64'));
        const infoZip = zip.getEntry('rocketlet.json');
        let info: IRocketletInfo;

        if (infoZip && !infoZip.isDirectory) {
            try {
                info = JSON.parse(infoZip.getData().toString()) as IRocketletInfo;

                if (!RocketletManager.uuid4Regex.test(info.id)) {
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

        zip.getEntries().forEach((entry) => {
            if (!entry.entryName.endsWith('.ts') || entry.isDirectory) {
                return;
            }

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

        // Compile all the typescript files to javascript
        // this actually modifies the `tsFiles` object
        this.getCompiler().toJs(info, tsFiles);

        // Now that is has all been compiled, let's get the
        // the Rocketlet instance from the source.
        const rocketlet = this.getCompiler().toSandBox(info, tsFiles);

        const compiledFiles: { [s: string]: string } = {};
        Object.keys(tsFiles).forEach((name) => {
            const norm = path.normalize(name);
            compiledFiles[norm.replace(/\./g, '$')] = tsFiles[norm].compiled;
        });

        return {
            info,
            compiledFiles,
            rocketlet,
        };
    }
}
