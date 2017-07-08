import { RocketletBridges } from './bridges';
import { ICompilerFile, IParseZipResult, RocketletCompiler } from './compiler';
import { ProxiedRocketlet } from './compiler/RocketletCompiler';
import { RocketletMethod } from './compiler/RocketletMethod';
import { IGetRocketletsFilter } from './IGetRocketletsFilter';
import {
    RocketletAccessorManager,
    RocketletListenerManger,
    RocketletLoggerManager,
    RocketletSlashCommandManager,
} from './managers';
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
    // tslint:disable-next-line:max-line-length
    private static uuid4Regex: RegExp = /^[0-9a-fA-f]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    private readonly availableRocketlets: Map<string, ProxiedRocketlet>;
    private readonly activeRocketlets: Map<string, ProxiedRocketlet>;
    private readonly inactiveRocketlets: Map<string, ProxiedRocketlet>;
    private readonly storage: RocketletStorage;
    private readonly bridges: RocketletBridges;
    private readonly compiler: RocketletCompiler;

    private readonly accessorManager: RocketletAccessorManager;
    private readonly listenerManager: RocketletListenerManger;
    private readonly logger: RocketletLoggerManager;
    private readonly commandManager: RocketletSlashCommandManager;

    constructor(rlStorage: RocketletStorage, rlBridges: RocketletBridges) {
        console.log('Constructed the RocketletManager.');

        if (rlStorage instanceof RocketletStorage) {
            this.storage = rlStorage;
        } else {
            throw new Error('Invalid instance of the RocketletStorage.');
        }

        if (rlBridges instanceof RocketletBridges) {
            this.bridges = rlBridges;
        } else {
            throw new Error('Invalid instance of the RocketletBridges');
        }

        this.availableRocketlets = new Map<string, ProxiedRocketlet>();
        this.activeRocketlets = new Map<string, ProxiedRocketlet>();
        this.inactiveRocketlets = new Map<string, ProxiedRocketlet>();

        this.logger = new RocketletLoggerManager();
        this.compiler = new RocketletCompiler(this.logger);
        this.accessorManager = new RocketletAccessorManager(this);
        this.listenerManager = new RocketletListenerManger(this);
        this.commandManager = new RocketletSlashCommandManager(this.bridges.getCommandBridge());
    }

    /** Gets the compiler instance. */
    public getCompiler(): RocketletCompiler {
        return this.compiler;
    }

    /** Gets the accessor manager instance. */
    public getAccessorManager(): RocketletAccessorManager {
        return this.accessorManager;
    }

    /** Gets the instance of the listener manager. */
    public getListenerManager(): RocketletListenerManger {
        return this.listenerManager;
    }

    /** Gets the command manager's instance. */
    public getCommandManager(): RocketletSlashCommandManager {
        return this.commandManager;
    }

    /**
     * Goes through the entire loading up process.
     * Except this to take some time, as it goes through a very
     * long process of loading all the Rocketlets up.
     */
    public async load(): Promise<Array<ProxiedRocketlet>> {
        const items: Map<string, IRocketletStorageItem> = await this.storage.retrieveAll();

        items.forEach((item: IRocketletStorageItem) => {
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

            this.availableRocketlets.set(item.id, this.getCompiler().toSandBox(item.info, files));
        });

        // Let's initialize them
        this.availableRocketlets.forEach((rl) =>
            rl.call(RocketletMethod.INITIALIZE, this.getAccessorManager().getConfigurationExtend(rl.getID())));

        // TODO: Enabling!

        return Array.from(this.availableRocketlets.values());
    }

    public async loadOne(id: string): Promise<ProxiedRocketlet> {
        throw new Error('Not implemented yet.');
    }

    public get(filter?: IGetRocketletsFilter): Array<ProxiedRocketlet> {
        if (filter) {
            console.warn('The filter is not yet implemented.');
        }

        const rls = new Array<ProxiedRocketlet>();
        this.availableRocketlets.forEach((rc, id) => rls.push(rc));

        return rls;
    }

    public enable(id: string): boolean {
        throw new Error('Not implemented yet.');
    }

    public disable(id: string): boolean {
        throw new Error('Not implemented yet.');
    }

    public async add(zipContentsBase64d: string): Promise<ProxiedRocketlet> {
        const result = await this.parseZip(zipContentsBase64d);
        const created = await this.storage.create({
            id: result.info.id,
            info: result.info,
            zip: zipContentsBase64d,
            compiled: result.compiledFiles,
            settings: {},
        });

        if (!created) {
            throw new Error('Failed to create the Rocketlet, the storage did not return it.');
        }

        this.availableRocketlets.set(result.info.id, result.rocketlet);
        return result.rocketlet;
    }

    public async update(zipContentsBase64d: string): Promise<ProxiedRocketlet> {
        const result = await this.parseZip(zipContentsBase64d);
        const old = await this.storage.retrieveOne(result.info.id);

        if (!old) {
            throw new Error('Can not update a Rocketlet that does not currently exist.');
        }

        const stored = await this.storage.update({
            createdAt: old.createdAt,
            id: result.info.id,
            info: result.info,
            zip: zipContentsBase64d,
            compiled: result.compiledFiles,
            settings: old.settings,
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
