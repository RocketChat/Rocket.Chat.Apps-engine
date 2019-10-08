import { IAsset } from './IAsset';

export interface IAssetProvider {
    getAssets(): Array<IAsset>;
}
