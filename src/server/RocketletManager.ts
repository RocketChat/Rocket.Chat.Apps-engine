import { RocketletBridges } from './bridges';
import { RocketletCompiler } from './compiler';
import { RocketletMethod } from './compiler/RocketletMethod';
import { RocketletPackageParser } from './compiler/RocketletPackageParser';
import { IGetRocketletsFilter } from './IGetRocketletsFilter';
import {
    RocketletAccessorManager,
    RocketletListenerManger,
    RocketletLoggerManager,
    RocketletSettingsManager,
    RocketletSlashCommandManager,
} from './managers';
import { ProxiedRocketlet } from './ProxiedRocketlet';
import { IRocketletStorageItem, RocketletStorage } from './storage';

import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';
import { RocketletStatus, RocketletStatusUtils } from 'temporary-rocketlets-ts-definition/RocketletStatus';

export class RocketletManager {
    public static ENV_VAR_NAME_FOR_ENABLING = 'USE_UNRELEASED_ROCKETAPPS_FRAMEWORK';
    public static SUPER_FUN_ENV_ENABLEMENT_NAME = 'LET_ME_HAVE_FUN_WITH_ROCKETS_NOW';

    // rocketlets contains all of the Rocketlets
    private readonly rocketlets: Map<string, ProxiedRocketlet>;
    private readonly storage: RocketletStorage;
    private readonly bridges: RocketletBridges;
    private readonly parser: RocketletPackageParser;
    private readonly compiler: RocketletCompiler;

    private readonly accessorManager: RocketletAccessorManager;
    private readonly listenerManager: RocketletListenerManger;
    private readonly logger: RocketletLoggerManager;
    private readonly commandManager: RocketletSlashCommandManager;
    private readonly settingsManager: RocketletSettingsManager;

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

        this.rocketlets = new Map<string, ProxiedRocketlet>();

        this.parser = new RocketletPackageParser(this);
        this.logger = new RocketletLoggerManager();
        this.compiler = new RocketletCompiler(this.logger);
        this.accessorManager = new RocketletAccessorManager(this);
        this.listenerManager = new RocketletListenerManger(this);
        this.commandManager = new RocketletSlashCommandManager(this.bridges.getCommandBridge(), this.accessorManager);
        this.settingsManager = new RocketletSettingsManager(this);

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

    /** Gets the manager of the settings, updates and getting. */
    public getSettingsManager(): RocketletSettingsManager {
        return this.settingsManager;
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

        items.forEach((item: IRocketletStorageItem) =>
            this.rocketlets.set(item.id, this.getCompiler().toSandBox(item)));

        // Let's initialize them
        this.rocketlets.forEach((rl) => this.initializeRocketlet(items.get(rl.getID()), rl));

        // Now let's enable the rocketlets which were once enabled
        this.rocketlets.forEach((rl) => {
            if (RocketletStatusUtils.isEnabled(rl.getPreviousStatus())) {
                this.enableRocketlet(items.get(rl.getID()), rl);
            }
        });

        // TODO: Register all of the listeners

        this.isLoaded = true;
        return Array.from(this.rocketlets.values());
    }

    /** Gets the Rocketlets which match the filter passed in. */
    public get(filter?: IGetRocketletsFilter): Array<ProxiedRocketlet> {
        let rls = new Array<ProxiedRocketlet>();

        if (typeof filter === 'undefined') {
            this.rocketlets.forEach((rl) => rls.push(rl));

            return rls;
        }

        let nothing = true;

        if (typeof filter.enabled === 'boolean' && filter.enabled) {
            this.rocketlets.forEach((rl) => {
                if (RocketletStatusUtils.isEnabled(rl.getStatus())) {
                    rls.push(rl);
                }
            });
            nothing = false;
        }

        if (typeof filter.disabled === 'boolean' && filter.disabled) {
            this.rocketlets.forEach((rl) => {
                if (RocketletStatusUtils.isDisabled(rl.getStatus())) {
                    rls.push(rl);
                }
            });
            nothing = false;
        }

        if (nothing) {
            this.rocketlets.forEach((rl) => rls.push(rl));
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

    /** Gets a single Rocketlet by the id passed in. */
    public getOneById(rocketletId: string): ProxiedRocketlet {
        return this.rocketlets.get(rocketletId);
    }

    public async enable(id: string): Promise<boolean> {
        const rl = this.rocketlets.get(id);

        if (!rl) {
            throw new Error(`No Rocketlet by the id "${id}" exists.`);
        }

        if (RocketletStatusUtils.isEnabled(rl.getStatus())) {
            throw new Error(`The Rocketlet with the id "${id}" is already enabled.`);
        }

        const storageItem = await this.storage.retrieveOne(id);
        if (!storageItem) {
            throw new Error(`Could not enable a Rocketlet with the id of "${id}" as it doesn't exist.`);
        }

        const isSetup = this.runStartUpProcess(storageItem, rl);
        if (isSetup) {
            rl.setStatus(RocketletStatus.MANUALLY_ENABLED);

            // This is async, but we don't care since it only updates in the database
            // and it should not mutate any properties we care about
            storageItem.status = rl.getStatus();
            this.storage.update(storageItem);

            try {
                this.bridges.getRocketletActivationBridge().rocketletEnabled(rl);
            } catch (e) {
                // If an error occurs during this, oh well.
            }
        }

        return isSetup;
    }

    public async disable(id: string, isManual = false): Promise<boolean> {
        const rl = this.rocketlets.get(id);

        if (!rl) {
            throw new Error(`No Rocketlet by the id "${id}" exists.`);
        }

        if (!RocketletStatusUtils.isEnabled(rl.getStatus())) {
            throw new Error(`No Rocketlet by the id of "${id}" is enabled."`);
        }

        const storageItem = await this.storage.retrieveOne(id);
        if (!storageItem) {
            throw new Error(`Could not disable a Rocketlet with the id of "${id}" as it doesn't exist.`);
        }

        try {
            rl.call(RocketletMethod.ONDISABLE, this.accessorManager.getConfigurationModify(storageItem.id));
        } catch (e) {
            console.warn('Error while disabling:', e);
        }

        this.commandManager.unregisterCommands(storageItem.id);
        this.accessorManager.purifyRocketlet(storageItem.id);

        if (isManual) {
            rl.setStatus(RocketletStatus.MANUALLY_DISABLED);
        }

        // This is async, but we don't care since it only updates in the database
        // and it should not mutate any properties we care about
        storageItem.status = rl.getStatus();
        this.storage.update(storageItem);

        try {
            this.bridges.getRocketletActivationBridge().rocketletDisabled(rl);
        } catch (e) {
            // If an error occurs during this, oh well.
        }

        return true;
    }

    public async add(zipContentsBase64d: string, enable = true): Promise<ProxiedRocketlet> {
        const result = await this.getParser().parseZip(zipContentsBase64d);
        const created = await this.storage.create({
            id: result.info.id,
            info: result.info,
            status: RocketletStatus.UNKNOWN,
            zip: zipContentsBase64d,
            compiled: result.compiledFiles,
            languageContent: result.languageContent,
            settings: {},
        });

        if (!created) {
            throw new Error('Failed to create the Rocketlet, the storage did not return it.');
        }

        // Now that is has all been compiled, let's get the
        // the Rocketlet instance from the source.
        const rocketlet = this.getCompiler().toSandBox(created);

        this.rocketlets.set(rocketlet.getID(), rocketlet);

        // Should enable === true, then we go through the entire start up process
        // Otherwise, we only initialize it.
        if (enable) {
            // Start up the rocketlet
            this.runStartUpProcess(created, rocketlet);
        } else {
            this.initializeRocketlet(created, rocketlet);
        }

        try {
            const isEnabled = RocketletStatusUtils.isEnabled(rocketlet.getStatus());
            this.bridges.getRocketletActivationBridge().rocketletLoaded(rocketlet, isEnabled);
        } catch (e) {
            // If an error occurs during this, oh well.
        }

        return rocketlet;
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

        // Attempt to disable it, if it wasn't enabled then it will error and we don't care
        try {
            await this.disable(old.id);
        } catch (e) {
            // We don't care
        }

        const stored = await this.storage.update({
            createdAt: old.createdAt,
            id: result.info.id,
            info: result.info,
            status: this.rocketlets.get(old.id).getStatus(),
            zip: zipContentsBase64d,
            compiled: result.compiledFiles,
            languageContent: result.languageContent,
            settings: old.settings,
        });

        // Now that is has all been compiled, let's get the
        // the Rocketlet instance from the source.
        const rocketlet = this.getCompiler().toSandBox(stored);

        // Store it temporarily so we can access it else where
        this.rocketlets.set(rocketlet.getID(), rocketlet);

        // Start up the rocketlet
        this.runStartUpProcess(stored, rocketlet);

        try {
            const isEnabled = RocketletStatusUtils.isEnabled(rocketlet.getStatus());
            this.bridges.getRocketletActivationBridge().rocketletUpdated(rocketlet, isEnabled);
        } catch (e) {
            // If an error occurs during this, oh well.
        }

        return rocketlet;
    }

    public getLanguageContent(): { [key: string]: object } {
        const langs: { [key: string]: object } = { };

        this.rocketlets.forEach((rl) => {
            const content = rl.getStorageItem().languageContent;

            Object.keys(content).forEach((key) => {
                langs[key] = Object.assign(langs[key] || {}, content[key]);
            });
        });

        return langs;
    }

    public async changeStatus(rocketletId: string, status: RocketletStatus): Promise<ProxiedRocketlet> {
        switch (status) {
            case RocketletStatus.MANUALLY_DISABLED:
            case RocketletStatus.MANUALLY_ENABLED:
                break;
            default:
                throw new Error('Invalid status to change a Rocketlet to, must be manually disabled or enabled.');
        }

        const rl = this.rocketlets.get(rocketletId);

        if (!rl) {
            throw new Error('Can not change the status of a Rocketlet which does not currently exist.');
        }

        if (RocketletStatusUtils.isEnabled(status)) {
            // Then enable it
            if (RocketletStatusUtils.isEnabled(rl.getStatus())) {
                throw new Error('Can not enable a Rocketlet which is already enabled.');
            }

            await this.enable(rl.getID());
        } else {
            if (!RocketletStatusUtils.isEnabled(rl.getStatus())) {
                throw new Error('Can not disable a Rocketlet which is not enabled.');
            }

            await this.disable(rl.getID(), true);
        }

        return rl;
    }

    private runStartUpProcess(storageItem: IRocketletStorageItem, rocketlet: ProxiedRocketlet): boolean {
        if (rocketlet.getStatus() !== RocketletStatus.INITIALIZED) {
            const isInitialized = this.initializeRocketlet(storageItem, rocketlet);
            if (!isInitialized) {
                return false;
            }
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
        const configExtend = this.getAccessorManager().getConfigurationExtend(storageItem.id);
        const envRead = this.getAccessorManager().getEnvironmentRead(storageItem.id);

        try {
            rocketlet.call(RocketletMethod.INITIALIZE, configExtend, envRead);
            result = true;
            rocketlet.setStatus(RocketletStatus.INITIALIZED);
        } catch (e) {
            if (e.name === 'NotEnoughMethodArgumentsError') {
                console.warn('Please report the following error:');
            }

            console.error(e);
            this.commandManager.unregisterCommands(storageItem.id);
            result = false;

            rocketlet.setStatus(RocketletStatus.ERROR_DISABLED);
        }

        // This is async, but we don't care since it only updates in the database
        // and it should not mutate any properties we care about
        storageItem.status = rocketlet.getStatus();
        this.storage.update(storageItem);

        return result;
    }

    private enableRocketlet(storageItem: IRocketletStorageItem, rocketlet: ProxiedRocketlet): boolean {
        let enable: boolean;

        try {
            enable = rocketlet.call(RocketletMethod.ONENABLE,
                this.getAccessorManager().getEnvironmentRead(storageItem.id),
                this.getAccessorManager().getConfigurationModify(storageItem.id)) as boolean;
            rocketlet.setStatus(RocketletStatus.AUTO_ENABLED);
        } catch (e) {
            enable = false;

            if (e.name === 'NotEnoughMethodArgumentsError') {
                console.warn('Please report the following error:');
            }

            console.error(e);
            rocketlet.setStatus(RocketletStatus.ERROR_DISABLED);
        }

        if (enable) {
            this.commandManager.registerCommands(rocketlet.getID());
        } else {
            this.commandManager.unregisterCommands(rocketlet.getID());
        }

        // This is async, but we don't care since it only updates in the database
        // and it should not mutate any properties we care about
        storageItem.status = rocketlet.getStatus();
        this.storage.update(storageItem);

        return enable;
    }
}
