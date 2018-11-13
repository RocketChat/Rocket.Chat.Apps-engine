import { IEnvironmentRead, IHttp, IModify, IRead } from '../../definition/accessors';
import { IApiEndpointMetadata } from '../api';
import { IPersistence } from './IPersistence';

export interface IAppAccessors {
    readonly environmentReader: IEnvironmentRead;
    readonly reader: IRead;
    readonly http: IHttp;
    readonly modifier: IModify;
    readonly persistence: IPersistence;
    readonly providedApiEndpoints: Array<IApiEndpointMetadata>;
}
