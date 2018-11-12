import { IEnvironmentRead, IHttp, IRead } from '../../definition/accessors';
import { IApiEndpointMetadata } from '../api';
export interface IAppAccessors {
    getEnvironmentRead(): IEnvironmentRead;
    getReader(): IRead;
    getHttp(): IHttp;
    getProvidedApiEndpoints(): Array<IApiEndpointMetadata>;
}
