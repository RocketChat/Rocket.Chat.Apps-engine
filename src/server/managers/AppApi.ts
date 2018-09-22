import { AppMethod } from '../../definition/metadata';

import { ApiSecurity, ApiVisibility, IApi, IApiRequest, IApiResponse } from '../../definition/api';
import { IApiEndpoint } from '../../definition/api/IApiEndpoint';
import { IApiEndpointInfo } from '../../definition/api/IApiEndpointInfo';
import { ProxiedApp } from '../ProxiedApp';
import { AppLogStorage } from '../storage';
import { AppAccessorManager } from './AppAccessorManager';

const methods: Array<string> = [
    'get',
    'post',
    'put',
    'delete',
    'head',
    'options',
    'patch',
];

export class AppApi {
    public readonly computedPath: string;
    public readonly basePath: string;
    public readonly appId: string;
    public readonly hash?: string;
    public readonly implementedMethods: Array<string>;

    constructor(public app: ProxiedApp, public api: IApi, public endpoint: IApiEndpoint) {
        this.appId = app.getID();

        switch (this.api.visibility) {
            case ApiVisibility.PUBLIC:
                this.basePath = `/apps/public/${app.getID()}`;
                break;

            case ApiVisibility.PRIVATE:
                this.basePath = `/apps/private/${app.getID()}/${app.getStorageItem()._id}`;
                this.hash = app.getStorageItem()._id;
                break;
        }

        this.computedPath = `${this.basePath}/${endpoint.path}`;

        this.implementedMethods = methods.filter((m) => typeof (api as any)[m] === 'function');
    }

    public async runExecutor(request: IApiRequest,
                             logStorage: AppLogStorage,
                             accessors: AppAccessorManager): Promise<IApiResponse> {

        const { path } = this.endpoint;

        const method = request.method;

        // Ensure the api has the property before going on
        if (typeof this.endpoint[method] !== 'function') {
            return;
        }

        if (!this.validateVisibility(request)) {
            return {
                status: 404,
            };
        }

        if (!this.validateSecurity(request)) {
            return {
                status: 401,
            };
        }

        const endpoint: IApiEndpointInfo = {
            basePath: this.basePath,
            fullPath: this.computedPath,
            appId: this.appId,
            hash: this.hash,
        };

        const runContext = this.app.makeContext({
            endpoint: this.endpoint,
            args: [
                request,
                endpoint,
                accessors.getReader(this.app.getID()),
                accessors.getModifier(this.app.getID()),
                accessors.getHttp(this.app.getID()),
                accessors.getPersistence(this.app.getID()),
            ],
        });

        const logger = this.app.setupLogger(AppMethod._API_EXECUTOR);
        logger.debug(`${ path }'s ${ method } is being executed...`, request);

        const runCode = `endpoint.${ method }.apply(endpoint, args)`;
        try {
            const result: IApiResponse = await this.app.runInContext(runCode, runContext);
            logger.debug(`${ path }'s ${ method } was successfully executed.`);
            logStorage.storeEntries(this.app.getID(), logger);
            return result;
        } catch (e) {
            logger.error(e);
            logger.debug(`${ path }'s ${ method } was unsuccessful.`);
            logStorage.storeEntries(this.app.getID(), logger);
            throw e;
        }
    }

    private validateVisibility(request: IApiRequest): boolean {
        if (this.api.visibility === ApiVisibility.PUBLIC) {
            return true;
        }

        if (this.api.visibility === ApiVisibility.PRIVATE) {
            return this.app.getStorageItem()._id === request.privateHash;
        }

        return false;
    }

    private validateSecurity(request: IApiRequest): boolean {
        if (this.api.security === ApiSecurity.UNSECURE) {
            return true;
        }

        return false;
    }
}
