import type { IAppAccessors } from '@rocket.chat/apps-engine/definition/accessors/IAppAccessors.ts';
import type { IEnvironmentWrite } from '@rocket.chat/apps-engine/definition/accessors/IEnvironmentWrite.ts';
import type { IEnvironmentRead } from '@rocket.chat/apps-engine/definition/accessors/IEnvironmentRead.ts';
import type { IConfigurationModify } from '@rocket.chat/apps-engine/definition/accessors/IConfigurationModify.ts';
import type { IRead } from '@rocket.chat/apps-engine/definition/accessors/IRead.ts';
import type { IModify } from '@rocket.chat/apps-engine/definition/accessors/IModify.ts';
import type { IPersistence } from '@rocket.chat/apps-engine/definition/accessors/IPersistence.ts';
import type { IHttp } from '@rocket.chat/apps-engine/definition/accessors/IHttp.ts';
import type { IConfigurationExtend } from '@rocket.chat/apps-engine/definition/accessors/IConfigurationExtend.ts';
import type { ISlashCommand } from '@rocket.chat/apps-engine/definition/slashcommands/ISlashCommand.ts';
import type { IUpload } from '@rocket.chat/apps-engine/definition/uploads/IUpload.ts'
import type { IProcessor } from '@rocket.chat/apps-engine/definition/scheduler/IProcessor.ts';
import type { IApi } from '@rocket.chat/apps-engine/definition/api/IApi.ts';
import type { IVideoConfProvider } from '@rocket.chat/apps-engine/definition/videoConfProviders/IVideoConfProvider.ts';

import * as Messenger from '../messenger.ts';
import { AppObjectRegistry } from '../../AppObjectRegistry.ts';
import { ModifyCreator } from './modify/ModifyCreator.ts';
import { ModifyUpdater } from './modify/ModifyUpdater.ts';
import { ModifyExtender } from './modify/ModifyExtender.ts';

import { require } from '../../lib/require.ts';
const Buffer = require('node:buffer')

const httpMethods = ['get', 'post', 'put', 'delete', 'head', 'options', 'patch'] as const;

export class AppAccessors {
    private defaultAppAccessors?: IAppAccessors;
    private environmentRead?: IEnvironmentRead;
    private environmentWriter?: IEnvironmentWrite;
    private configModifier?: IConfigurationModify;
    private configExtender?: IConfigurationExtend;
    private reader?: IRead;
    private modifier?: IModify;
    private persistence?: IPersistence;
    private http?: IHttp;
    private creator?: ModifyCreator;
    private updater?: ModifyUpdater;
    private extender?: ModifyExtender;

    private proxify: <T>(namespace: string) => T;

    constructor(private readonly senderFn: typeof Messenger.sendRequest) {
        this.proxify = <T>(namespace: string): T =>
            new Proxy(
                { __kind: `accessor:${namespace}` },
                {
                    get:
                        (_target: unknown, prop: string) =>
                        (...params: unknown[]) =>
                            prop === 'toJSON'
                                ? {}
                                : senderFn({
                                      method: `accessor:${namespace}:${prop}`,
                                      params,
                                  }).then((response) => response.result),
                },
            ) as T;
    }

    public getSenderFn() {
        return this.senderFn;
    }

    public getEnvironmentRead(): IEnvironmentRead {
        if (!this.environmentRead) {
            this.environmentRead = {
                getSettings: () => this.proxify('getEnvironmentRead:getSettings'),
                getServerSettings: () => this.proxify('getEnvironmentRead:getServerSettings'),
                getEnvironmentVariables: () => this.proxify('getEnvironmentRead:getEnvironmentVariables'),
            };
        }

        return this.environmentRead;
    }

    public getEnvironmentWrite() {
        if (!this.environmentWriter) {
            this.environmentWriter = {
                getSettings: () => this.proxify('getEnvironmentWrite:getSettings'),
                getServerSettings: () => this.proxify('getEnvironmentWrite:getServerSettings'),
            };
        }

        return this.environmentWriter;
    }

    public getConfigurationModify() {
        if (!this.configModifier) {
            this.configModifier = {
                scheduler: this.proxify('getConfigurationModify:scheduler'),
                slashCommands: {
                    _proxy: this.proxify('getConfigurationModify:slashCommands'),
                    modifySlashCommand(slashcommand: ISlashCommand) {
                        // Store the slashcommand instance to use when the Apps-Engine calls the slashcommand
                        AppObjectRegistry.set(`slashcommand:${slashcommand.command}`, slashcommand);

                        return this._proxy.modifySlashCommand(slashcommand);
                    },
                    disableSlashCommand(command: string) {
                        return this._proxy.disableSlashCommand(command);
                    },
                    enableSlashCommand(command: string) {
                        return this._proxy.enableSlashCommand(command);
                    },
                },
                serverSettings: this.proxify('getConfigurationModify:serverSettings'),
            };
        }

        return this.configModifier;
    }

    public getConfigurationExtend() {
        if (!this.configExtender) {
            this.configExtender = {
                ui: this.proxify('getConfigurationExtend:ui'),
                http: this.proxify('getConfigurationExtend:http'),
                settings: this.proxify('getConfigurationExtend:settings'),
                externalComponents: this.proxify('getConfigurationExtend:externalComponents'),
                api: {
                    _proxy: this.proxify('getConfigurationExtend:api'),
                    provideApi(api: IApi) {
                        api.endpoints.forEach((endpoint) => {
                            AppObjectRegistry.set(`api:${endpoint.path}`, endpoint);

                            endpoint._availableMethods = httpMethods.filter((method) => typeof endpoint[method] === 'function');
                        });

                        return this._proxy.provideApi(api);
                    },
                },
                scheduler: {
                    _proxy: this.proxify('getConfigurationExtend:scheduler'),
                    registerProcessors(processors: IProcessor[]) {
                        // Store the processor instance to use when the Apps-Engine calls the processor
                        processors.forEach((processor) => {
                            AppObjectRegistry.set(`scheduler:${processor.id}`, processor);
                        });

                        return this._proxy.registerProcessors(processors);
                    },
                },
                videoConfProviders: {
                    _proxy: this.proxify('getConfigurationExtend:videoConfProviders'),
                    provideVideoConfProvider(provider: IVideoConfProvider) {
                        // Store the videoConfProvider instance to use when the Apps-Engine calls the videoConfProvider
                        AppObjectRegistry.set(`videoConfProvider:${provider.name}`, provider);

                        return this._proxy.provideVideoConfProvider(provider);
                    },
                },
                slashCommands: {
                    _proxy: this.proxify('getConfigurationExtend:slashCommands'),
                    provideSlashCommand(slashcommand: ISlashCommand) {
                        // Store the slashcommand instance to use when the Apps-Engine calls the slashcommand
                        AppObjectRegistry.set(`slashcommand:${slashcommand.command}`, slashcommand);

                        return this._proxy.provideSlashCommand(slashcommand);
                    },
                },
            };
        }

        return this.configExtender;
    }

    public getDefaultAppAccessors() {
        if (!this.defaultAppAccessors) {
            this.defaultAppAccessors = {
                environmentReader: this.getEnvironmentRead(),
                environmentWriter: this.getEnvironmentWrite(),
                reader: this.getReader(),
                http: this.getHttp(),
                providedApiEndpoints: this.proxify('api:listApis'),
            };
        }

        return this.defaultAppAccessors;
    }

    public getReader() {
        if (!this.reader) {
            this.reader = {
                getEnvironmentReader: () => ({
                    getSettings: () => this.proxify('getReader:getEnvironmentReader:getSettings'),
                    getServerSettings: () => this.proxify('getReader:getEnvironmentReader:getServerSettings'),
                    getEnvironmentVariables: () => this.proxify('getReader:getEnvironmentReader:getEnvironmentVariables'),
                }),
                getMessageReader: () => this.proxify('getReader:getMessageReader'),
                getPersistenceReader: () => this.proxify('getReader:getPersistenceReader'),
                getRoomReader: () => this.proxify('getReader:getRoomReader'),
                getUserReader: () => this.proxify('getReader:getUserReader'),
                getNotifier: () => this.proxify('getReader:getNotifier'),
                getLivechatReader: () => this.proxify('getReader:getLivechatReader'),
                getUploadReader: () => ({
                    _proxy: this.proxify('getReader:getUploadReader'),
                    getById(id: string) {
                        return this._proxy.getById(id);
                    },
                    // Convert the Uint8Array to a Buffer 
                    async getBufferById(id: string) {
                        const result = await this._proxy.getBufferById(id);
                        return Buffer.from(result);
                    },
                    // Convert the Uint8Array to a Buffer 
                    async getBuffer(upload: IUpload) {
                        const result = await this._proxy.getBuffer(upload);
                        return Buffer.from(result);
                    },

                }),
                getCloudWorkspaceReader: () => this.proxify('getReader:getCloudWorkspaceReader'),
                getVideoConferenceReader: () => this.proxify('getReader:getVideoConferenceReader'),
                getOAuthAppsReader: () => this.proxify('getReader:getOAuthAppsReader'),
                getThreadReader: () => this.proxify('getReader:getThreadReader'),
                getRoleReader: () => this.proxify('getReader:getRoleReader'),
            };
        }

        return this.reader;
    }

    public getModifier() {
        if (!this.modifier) {
            this.modifier = {
                getCreator: this.getCreator.bind(this),
                getUpdater: this.getUpdater.bind(this),
                getExtender: this.getExtender.bind(this),
                getDeleter: () => this.proxify('getModifier:getDeleter'),
                getNotifier: () => this.proxify('getModifier:getNotifier'),
                getUiController: () => this.proxify('getModifier:getUiController'),
                getScheduler: () => this.proxify('getModifier:getScheduler'),
                getOAuthAppsModifier: () => this.proxify('getModifier:getOAuthAppsModifier'),
                getModerationModifier: () => this.proxify('getModifier:getModerationModifier'),
            };
        }

        return this.modifier;
    }

    public getPersistence() {
        if (!this.persistence) {
            this.persistence = this.proxify('getPersistence');
        }

        return this.persistence;
    }

    public getHttp() {
        if (!this.http) {
            this.http = this.proxify('getHttp');
        }

        return this.http;
    }

    private getCreator() {
        if (!this.creator) {
            this.creator = new ModifyCreator(this.senderFn);
        }

        return this.creator;
    }

    private getUpdater() {
        if (!this.updater) {
            this.updater = new ModifyUpdater(this.senderFn);
        }

        return this.updater;
    }

    private getExtender() {
        if (!this.extender) {
            this.extender = new ModifyExtender(this.senderFn);
        }

        return this.extender;
    }
}

export const AppAccessorsInstance = new AppAccessors(Messenger.sendRequest);
