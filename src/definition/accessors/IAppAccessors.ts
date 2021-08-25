import { IEnvironmentRead, IHttp, INet, IRead } from '../../definition/accessors';
import { IApiEndpointMetadata } from '../api';

export interface IAppAccessors {
    readonly environmentReader: IEnvironmentRead;
    readonly reader: IRead;
    readonly http: IHttp;
    readonly net: INet;
    readonly providedApiEndpoints: Array<IApiEndpointMetadata>;
}
