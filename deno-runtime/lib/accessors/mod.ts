import { IAppAccessors } from '@rocket.chat/apps-engine/definition/accessors/IAppAccessors.ts';
import { IEnvironmentWrite } from '@rocket.chat/apps-engine/definition/accessors/IEnvironmentWrite.ts';
import { IEnvironmentRead } from '@rocket.chat/apps-engine/definition/accessors/IEnvironmentRead.ts';

export function proxify(namespace: string) {
    return new Proxy(
        {},
        {
            get(target: unknown, prop: string): unknown {
                return (...args: unknown[]) => {
                    return {};
                };
            },
        },
    );
}

export class AppAccessors {
    private environmentReader?: IEnvironmentRead;
    private defaultAppAccessors?: IAppAccessors;
    private environmentWriter?: IEnvironmentWrite;

    constructor(private readonly appId: string) {}

    public getEnvironmentReader() {
        if (!this.environmentReader) {
            this.environmentReader = {
                getSettings: this.getSettingsReader(),
                getServerSettings: this.getServerSettingsReader(),
                getEnvironmentVariables: this.getEnvironmentVariablesReader(),
            }
        }

        return this.environmentReader;
    }

    public getEnvironmentWriter() {
        if (!this.environmentWriter) {
            this.environmentWriter = {
                getSettings: this.getSettingsUpdater(),
                getServerSettings: this.getServerSettingsUpdater(),
            }
        }

        return this.environmentWriter;
    }

    public getDefaultAppAccessors() {
        if (!this.defaultAppAccessors) {
            this.defaultAppAccessors = {
                environmentReader: this.getEnvironmentReader(),
                environmentWriter: this.getEnvironmentWriter(),
                reader: this.getReader(),
                http: this.getHttp(),
                providedApiEndpoints: this.getProvidedApiEndpoints(),
            }
        }

        return this.defaultAppAccessors;
    }
}
