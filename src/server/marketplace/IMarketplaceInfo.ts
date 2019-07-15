import { IAppInfo } from '../../definition/metadata';
import { IMarketplacePricingPlan } from './IMarketplacePricingPlan';
import { IMarketplaceSimpleBundleInfo } from './IMarketplaceSimpleBundleInfo';
import { IMarketplaceSubscriptionInfo } from './IMarketplaceSubscriptionInfo';
import { MarketplacePurchaseType } from './MarketplacePurchaseType';

export interface IMarketplaceInfo extends IAppInfo {
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
    subscriptionInfo: IMarketplaceSubscriptionInfo;
    puchaseType: MarketplacePurchaseType;
    pricingPlans?: Array<IMarketplacePricingPlan>;
    bundledIn?: Array<IMarketplaceSimpleBundleInfo>;
}
