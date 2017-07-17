import { RocketletBridges } from './bridges';
import { ICompilerFile, RocketletCompiler } from './compiler';
import { RocketletMethod } from './compiler/RocketletMethod';
import { RocketletPackageParser } from './compiler/RocketletPackageParser';
import { IGetRocketletsFilter } from './IGetRocketletsFilter';
import {
    RocketletAccessorManager,
    RocketletListenerManger,
    RocketletLoggerManager,
    RocketletSlashCommandManager,
} from './managers';
import { ProxiedRocketlet } from './ProxiedRocketlet';
import { IRocketletStorageItem, RocketletStorage } from './storage';

import { IRocketletInfo } from 'temporary-rocketlets-ts-definition/metadata';
import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';

export class RocketletManager {
    private readonly availableRocketlets: Map<string, ProxiedRocketlet>;
    private readonly activeRocketlets: Map<string, ProxiedRocketlet>;
    private readonly inactiveRocketlets: Map<string, ProxiedRocketlet>;
    private readonly storage: RocketletStorage;
    private readonly bridges: RocketletBridges;
    private readonly parser: RocketletPackageParser;
    private readonly compiler: RocketletCompiler;

    private readonly accessorManager: RocketletAccessorManager;
    private readonly listenerManager: RocketletListenerManger;
    private readonly logger: RocketletLoggerManager;
    private readonly commandManager: RocketletSlashCommandManager;

    private isLoaded: boolean;

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

        this.parser = new RocketletPackageParser(this);
        this.logger = new RocketletLoggerManager();
        this.compiler = new RocketletCompiler(this.logger);
        this.accessorManager = new RocketletAccessorManager(this);
        this.listenerManager = new RocketletListenerManger(this);
        this.commandManager = new RocketletSlashCommandManager(this.bridges.getCommandBridge());

        this.isLoaded = false;
    }

    /** Gets the instance of the storage connector. */
    public getStorage(): RocketletStorage {
        return this.storage;
    }

    /** Gets the instance of the Rocketlet package parser. */
    public getParser(): RocketletPackageParser {
        return this.parser;
    }

    /** Gets the compiler instance. */
    public getCompiler(): RocketletCompiler {
        return this.compiler;
    }

    /** Gets the accessor manager instance. */
    public getAccessorManager(): RocketletAccessorManager {
        return this.accessorManager;
    }

    /** Gets the instance of the Bridge manager. */
    public getBridgeManager(): RocketletBridges {
        return this.bridges;
    }

    /** Gets the instance of the listener manager. */
    public getListenerManager(): RocketletListenerManger {
        return this.listenerManager;
    }

    /** Gets the command manager's instance. */
    public getCommandManager(): RocketletSlashCommandManager {
        return this.commandManager;
    }

    /** Gets whether the Rocketlets have been loaded or not. */
    public areRocketletsLoaded(): boolean {
        return this.isLoaded;
    }

    /**
     * Goes through the entire loading up process.
     * Except this to take some time, as it goes through a very
     * long process of loading all the Rocketlets up.
     */
    public async load(): Promise<Array<ProxiedRocketlet>> {
        const items: Map<string, IRocketletStorageItem> = await this.storage.retrieveAll();

        items.forEach((item: IRocketletStorageItem) => {
            const files: { [key: string]: ICompilerFile} = this.compiler.storageFilesToCompiler(item.compiled);

            this.availableRocketlets.set(item.id, this.getCompiler().toSandBox(item.info, files));
        });

        // Let's initialize them
        this.availableRocketlets.forEach((rl) => {
            const isInitialized = this.initializeRocketlet(items.get(rl.getID()), rl);

            if (!isInitialized) {
                this.inactiveRocketlets.set(rl.getID(), rl);
            }
        });

        // Now let's enable all of the rocketlets
        this.availableRocketlets.forEach((rl) => this.enableRocketlet(items.get(rl.getID()), rl));

        // TODO: Register all of the listeners

        this.isLoaded = true;
        return Array.from(this.activeRocketlets.values()).concat(Array.from(this.inactiveRocketlets.values()));
    }

    public get(filter?: IGetRocketletsFilter): Array<ProxiedRocketlet> {
        let rls = new Array<ProxiedRocketlet>();

        if (typeof filter === 'undefined') {
            this.activeRocketlets.forEach((rl) => rls.push(rl));
            this.activeRocketlets.forEach((rl) => rls.push(rl));

            return rls;
        }

        let nothing = true;

        if (typeof filter.enabled === 'boolean' && filter.enabled) {
            this.activeRocketlets.forEach((rl) => rls.push(rl));
            nothing = false;
        }

        if (typeof filter.disabled === 'boolean' && filter.disabled) {
            this.activeRocketlets.forEach((rl) => rls.push(rl));
            nothing = false;
        }

        if (nothing) {
            this.activeRocketlets.forEach((rl) => rls.push(rl));
            this.activeRocketlets.forEach((rl) => rls.push(rl));
        }

        if (typeof filter.ids !== 'undefined') {
            rls = rls.filter((rl) => filter.ids.includes(rl.getID()));
        }

        if (typeof filter.name === 'string') {
            rls = rls.filter((rl) => rl.getName() === filter.name);
        } else if (filter.name instanceof RegExp) {
            rls = rls.filter((rl) => (filter.name as RegExp).test(rl.getName()));
        }

        return rls;
    }

    public async enable(id: string): Promise<boolean> {
        if (this.activeRocketlets.has(id)) {
            throw new Error(`The Rocketlet with the id "${id}" is already enabled.`);
        }

        if (!this.inactiveRocketlets.has(id)) {
            throw new Error(`No Rocketlet by the id "${id}" is inactive.`);
        }

        const rocketlet = this.inactiveRocketlets.get(id);
        const storageItem = await this.storage.retrieveOne(id);
        if (!storageItem) {
            throw new Error(`Could not enable a Rocketlet with the id of "${id}" as it doesn't exist.`);
        }

        const isSetup = this.runStartUpProcess(storageItem, rocketlet);
        if (isSetup) {
            this.activeRocketlets.set(storageItem.id, rocketlet);
            this.inactiveRocketlets.delete(storageItem.id);
        }

        return isSetup;
    }

    public async disable(id: string): Promise<boolean> {
        if (this.inactiveRocketlets.has(id)) {
            throw new Error(`The Rocketlet with the id of "${id}" is already disabled.`);
        }

        if (!this.activeRocketlets.has(id)) {
            throw new Error(`No Rocketlet by the id of "${id}" is enabled."`);
        }

        const rocketlet = this.activeRocketlets.get(id);
        const storageItem = await this.storage.retrieveOne(id);
        if (!storageItem) {
            throw new Error(`Could not disable a Rocketlet with the id of "${id}" as it doesn't exist.`);
        }

        try {
            rocketlet.call(RocketletMethod.ONDISABLE, this.accessorManager.getConfigurationModify(storageItem));
        } catch (e) {
            console.warn('Error while disabling:', e);
        }

        this.commandManager.unregisterCommands(storageItem.id);

        this.inactiveRocketlets.set(storageItem.id, rocketlet);
        this.activeRocketlets.delete(storageItem.id);

        return true;
    }

    public async add(zipContentsBase64d: string): Promise<ProxiedRocketlet> {
        const result = await this.getParser().parseZip(zipContentsBase64d);
        const created = await this.storage.create({
            id: result.info.id,
            info: result.info,
            zip: zipContentsBase64d,
            compiled: result.compiledFiles,
            languageFiles: result.languageFiles,
            settings: {},
        });

        if (!created) {
            throw new Error('Failed to create the Rocketlet, the storage did not return it.');
        }

        // Start up the rocketlet
        this.runStartUpProcess(created, result.rocketlet);

        return result.rocketlet;
    }

    public remove(id: string): Rocketlet {
        throw new Error('Not implemented nor architected.');
    }

    public async update(zipContentsBase64d: string): Promise<ProxiedRocketlet> {
        const result = await this.getParser().parseZip(zipContentsBase64d);
        const old = await this.storage.retrieveOne(result.info.id);

        if (!old) {
            throw new Error('Can not update a Rocketlet that does not currently exist.');
        }

        await this.disable(old.id);
        this.inactiveRocketlets.delete(old.id);

        const stored = await this.storage.update({
            createdAt: old.createdAt,
            id: result.info.id,
            info: result.info,
            zip: zipContentsBase64d,
            compiled: result.compiledFiles,
            languageFiles: result.languageFiles,
            settings: old.settings,
        });

        // Start up the rocketlet
        this.runStartUpProcess(stored, result.rocketlet);

        return result.rocketlet;
    }

    private runStartUpProcess(storageItem: IRocketletStorageItem, rocketlet: ProxiedRocketlet): boolean {
        const isInitialized = this.initializeRocketlet(storageItem, rocketlet);
        if (!isInitialized) {
            this.inactiveRocketlets.set(storageItem.id, rocketlet);
            return false;
        }

        const isEnabled = this.enableRocketlet(storageItem, rocketlet);
        if (!isEnabled) {
            return false;
        }

        // TODO: Register all of the listeners

        return true;
    }

    private initializeRocketlet(storageItem: IRocketletStorageItem, rocketlet: ProxiedRocketlet): boolean {
        let result: boolean;
        const configExtend = this.getAccessorManager().getConfigurationExtend(storageItem);

        try {
            rocketlet.call(RocketletMethod.INITIALIZE, configExtend);
            result = true;
        } catch (e) {
            if (e.name === 'NotEnoughMethodArgumentsError') {
                console.warn('Please report the following error:');
            }

            console.error(e);
            this.commandManager.unregisterCommands(storageItem.id);
            result = false;
        }

        // This is async, but we don't care since it only updates in the database
        // and it should not mutate any properties we care about
        this.storage.update(storageItem);

        return result;
    }

    private enableRocketlet(storageItem: IRocketletStorageItem, rocketlet: ProxiedRocketlet): boolean {
        let enable: boolean;

        try {
            enable = rocketlet.call(RocketletMethod.ONENABLE,
                this.getAccessorManager().getEnvironmentRead(storageItem),
                this.getAccessorManager().getConfigurationModify(storageItem)) as boolean;
        } catch (e) {
            enable = false;
            this.commandManager.unregisterCommands(storageItem.id);

            if (e.name === 'NotEnoughMethodArgumentsError') {
                console.warn('Please report the following error:');
            }

            console.error(e);
        }

        if (enable) {
            this.activeRocketlets.set(rocketlet.getID(), rocketlet);
        } else {
            this.inactiveRocketlets.set(rocketlet.getID(), rocketlet);
        }

        this.availableRocketlets.delete(rocketlet.getID());

        return enable;
    }
}
