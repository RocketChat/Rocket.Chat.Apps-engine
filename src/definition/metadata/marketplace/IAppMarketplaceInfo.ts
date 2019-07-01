import { IAppInfo } from '..';
import { IAppMarketplacePricingInfo } from './IAppMarketplacePricingInfo';
import { IAppMarketplaceSimpleBundleInfo } from './IAppMarketplaceSimpleBundleInfo';

export interface IAppMarketplaceInfo extends IAppInfo {
    categories: Array<string>;
    status: string;
    reviewedNote?: string;
    rejectionNote?: string;
    isVisible: boolean;
    isPurchased: boolean;
    isSubscribed: boolean;
    isBundled: boolean;
    createdDate: string;
    modifiedDate: string;
    price: number;
    pricingInfo: IAppMarketplacePricingInfo;
    bundledIn?: Array<IAppMarketplaceSimpleBundleInfo>;
}
