// @ts-ignore - this is a hack to make the tests work
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
import type { IVideoConfProvider } from '@rocket.chat/apps-engine/definition/videoConfProviders/IVideoConfProvider.ts';

import * as Messenger from '../messenger.ts';
import { AppObjectRegistry } from "../../main.ts";

export const getProxify = (call: typeof Messenger.sendRequest) =>
    function proxify<T>(namespace: string): T {
        return new Proxy(
            { __kind: namespace }, // debugging purposes
            {
                get:
                    (_target: unknown, prop: string) =>
                    (...params: unknown[]) =>
                        call({
                            method: `accessor:${namespace}:${prop}`,
                            params,
                        }),
            },
        ) as T;
    };

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

    constructor(private readonly proxify: <T>(n: string) => T) {}

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
                slashCommands: this.proxify('getConfigurationModify:slashCommands'),
                serverSettings: this.proxify('getConfigurationModify:serverSettings'),
            };
        }

        return this.configModifier;
    }

    public getConifgurationExtend() {
        if (!this.configExtender) {
            this.configExtender = {
                ui: this.proxify('getConfigurationExtend:ui'),
                api: this.proxify('getConfigurationExtend:api'),
                http: this.proxify('getConfigurationExtend:http'),
                settings: this.proxify('getConfigurationExtend:settings'),
                scheduler: this.proxify('getConfigurationExtend:scheduler'),
                externalComponents: this.proxify('getConfigurationExtend:externalComponents'),
                videoConfProviders: {
                    provideVideoConfProvider: async (provider: IVideoConfProvider) => {
                        // Store the videoConfProvider instance to use when the Apps-Engine calls the videoConfProvider
                        AppObjectRegistry.set(`videoConfProvider:${provider.name}`, provider);

                        await Messenger.sendRequest({
                            method: 'accessor:getConfigurationExtend:videoConfProviders:provideVideoConfProvider',
                            params: [provider],
                        });
                    },
                },
                slashCommands: {
                    provideSlashCommand: async (slashcommand: ISlashCommand) => {
                        // Store the slashcommand instance to use when the Apps-Engine calls the slashcommand
                        AppObjectRegistry.set(`slashcommand:${slashcommand.command}`, slashcommand);

                        await Messenger.sendRequest({
                            method: 'accessor:getConfigurationExtend:slashCommands:provideSlashCommand',
                            params: [slashcommand],
                        });
                    }
                }
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
                providedApiEndpoints: this.proxify('providedApiEndpoints'),
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
                getUploadReader: () => this.proxify('getReader:getUploadReader'),
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
                getCreator: () => this.proxify('getModifier:getCreator'), // can't be proxy
                getUpdater: () => this.proxify('getModifier:getUpdater'), // can't be proxy
                getDeleter: () => this.proxify('getModifier:getDeleter'),
                getExtender: () => this.proxify('getModifier:getExtender'), // can't be proxy
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
}

export const AppAccessorsInstance = new AppAccessors(getProxify(Messenger.sendRequest.bind(Messenger)));
