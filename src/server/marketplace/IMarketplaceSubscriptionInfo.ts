import { IAppLicenseMetadata } from './IAppLicenseMetadata';
import { MarketplaceSubscriptionStatus } from './MarketplaceSubscriptionStatus';
import { MarketplaceSubscriptionType } from './MarketplaceSubscriptionType';

export interface IMarketplaceSubscriptionInfo {
    seats: number;
    maxSeats: number;
    startDate: string;
    periodEnd: string;
    isSubscripbedViaBundle: boolean;
    endDate?: string;
    typeOf: MarketplaceSubscriptionType;
    status: MarketplaceSubscriptionStatus;
    license: IAppLicenseMetadata;
}
