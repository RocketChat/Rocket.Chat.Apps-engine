import { IEnvironmentRead, IHttp, IRead } from '../../definition/accessors';
import { IApiEndpointMetadata } from '../api';
import { IEnvironmentWrite } from './IEnvironmentWrite';

export interface IAppAccessors {
    readonly environmentReader: IEnvironmentRead;
    readonly environmentWriter: IEnvironmentWrite;
    readonly reader: IRead;
    readonly http: IHttp;
    readonly providedApiEndpoints: Array<IApiEndpointMetadata>;
}
