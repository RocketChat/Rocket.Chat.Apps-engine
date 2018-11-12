import { IEnvironmentRead, IHttp, IRead } from '../../definition/accessors';
import { IApiEndpointMetadata } from '../api';
export interface IAppAccessors {
    readonly environmentReader: IEnvironmentRead;
    readonly reader: IRead;
    readonly http: IHttp;
    readonly providedApiEndpoints: Array<IApiEndpointMetadata>;
}
