import type { IUser } from '../users';

export interface IAppUpdateContext {
    user: IUser | null;
    oldAppVersion: string;
}
