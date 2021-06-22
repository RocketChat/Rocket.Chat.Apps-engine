import { IAppStorageItem } from './IAppStorageItem';

export interface IAppSourceItem extends Omit<IAppStorageItem, 'path'> {
    zip: string;
    compiled: { [s: string]: string };
}
