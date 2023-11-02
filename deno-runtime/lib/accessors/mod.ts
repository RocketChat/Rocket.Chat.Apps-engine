import { IAppAccessors } from '@rocket.chat/apps-engine/definition/accessors/IAppAccessors.ts';
import { IEnvironmentWrite } from '@rocket.chat/apps-engine/definition/accessors/IEnvironmentWrite.ts';
import { IEnvironmentRead } from '@rocket.chat/apps-engine/definition/accessors/IEnvironmentRead.ts';
import { IConfigurationModify } from '@rocket.chat/apps-engine/definition/accessors/IConfigurationModify.ts';
import { IRead } from '@rocket.chat/apps-engine/definition/accessors/IRead.ts';
import { IConfigurationExtend } from '@rocket.chat/apps-engine/definition/accessors/IConfigurationExtend.ts';

import * as Messenger from '../messenger.ts';

export function proxify<T>(namespace: string): T {
    return new Proxy(
        {},
        {
            get:
                (_target: unknown, prop: string) =>
                (...params: unknown[]) =>
                    Messenger.sendRequest({
                        method: `accessor:${namespace}.${prop}`,
                        params,
                    }),
        },
    ) as T;
}

export class AppAccessors {
    private defaultAppAccessors?: IAppAccessors;
    private environmentWriter?: IEnvironmentWrite;
    private configModifier?: IConfigurationModify;
    private configExtender?: IConfigurationExtend;
    private reader?: IRead;

    public getEnvironmentRead(namespacePrefix = ''): IEnvironmentRead {
        // Not worth it to "cache" this one because of the prefix
        return {
            getSettings: () => proxify(namespacePrefix + 'environmentRead.getSettings'),
            getServerSettings: () => proxify(namespacePrefix + 'environmentRead.getServerSettings'),
            getEnvironmentVariables: () => proxify(namespacePrefix + 'environmentRead.getEnvironmentVariables'),
        };
    }

    public getEnvironmentWrite() {
        if (!this.environmentWriter) {
            this.environmentWriter = {
                getSettings: () => proxify('environmentWrite.getSettings'),
                getServerSettings: () => proxify('environmentWrite.getServerSettings'),
            };
        }

        return this.environmentWriter;
    }

    public getConfigurationModify() {
        if (!this.configModifier) {
            this.configModifier = {
                scheduler: proxify('configurationModify.scheduler'),
                slashCommands: proxify('configurationModify.slashCommands'),
                serverSettings: proxify('configurationModify.serverSettings'),
            };
        }

        return this.configModifier;
    }

    public getConifgurationExtend() {
        if (!this.configExtender) {
            this.configExtender = {
                ui: proxify('configurationExtend.ui'),
                api: proxify('configurationExtend.api'),
                http: proxify('configurationExtend.http'),
                settings: proxify('configurationExtend.settings'),
                scheduler: proxify('configurationExtend.scheduler'),
                slashCommands: proxify('configurationExtend.slashCommands'),
                externalComponents: proxify('configurationExtend.externalComponents'),
                videoConfProviders: proxify('configurationExtend.videoConfProviders'),
            }
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
                providedApiEndpoints: proxify('providedApiEndpoints'),
            };
        }

        return this.defaultAppAccessors;
    }

    public getReader() {
        if (!this.reader) {
            this.reader = {
                getEnvironmentReader: () => this.getEnvironmentRead('reader.'),
                getMessageReader: () => proxify('reader.getMessageReader'),
                getPersistenceReader: () => proxify('reader.getPersistenceReader'),
                getRoomReader: () => proxify('reader.getRoomReader'),
                getUserReader: () => proxify('reader.getUserReader'),
                getNotifier: () => proxify('reader.getNotifier'),
                getLivechatReader: () => proxify('reader.getLivechatReader'),
                getUploadReader: () => proxify('reader.getUploadReader'),
                getCloudWorkspaceReader: () => proxify('reader.getCloudWorkspaceReader'),
                getVideoConferenceReader: () => proxify('reader.getVideoConferenceReader'),
                getOAuthAppsReader: () => proxify('reader.getOAuthAppsReader'),
                getThreadReader: () => proxify('reader.getThreadReader'),
                getRoleReader: () => proxify('reader.getRoleReader'),
            };
        }

        return this.reader;
    }

    public getHttp() {
        return proxify('http');
    }
}

export const AppAccessorsInstance = new AppAccessors();
