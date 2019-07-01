import { IAppMarketplaceInfo } from '../../definition/metadata';
import { AppManager } from '../AppManager';
import { AppFabricationFulfillment } from '../compiler';
import { Crypto } from '../misc/Crypto';

export class AppLicenseManager {
    private readonly crypto: Crypto;
    constructor(private readonly manager: AppManager) {
        this.crypto = new Crypto(this.manager.getBridges().getServerSettingBridge());
    }

    // tslint:disable-next-line: no-empty
    public async validate(appMarketplaceInfo: IAppMarketplaceInfo, fabricationFulfillment: AppFabricationFulfillment): Promise<void> {
        const { id: appId } = appMarketplaceInfo;
        const encryptedLicense = ''; // appMarketplaceInfo.somepath.license

        try {
            const license = await this.crypto.decryptLicense(encryptedLicense, appId) as any;

            if (license.appId !== appId) {
                throw new Error('Invalid license');
            }

            const renewal = new Date(license.renewalDate);
            const expire = new Date(license.expireDate);
            const now = new Date();

            if (renewal < now) {
                // set warning for admin
            }

            if (expire < now) {
                throw new Error('Invalid license');
            }

        } catch (err) {
            fabricationFulfillment.setLicenseError(err);
            throw err;
        }

    }
}
