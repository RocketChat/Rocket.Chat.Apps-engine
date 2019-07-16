import { AppManager } from '../AppManager';
import { IUserBridge } from '../bridges';
import { IMarketplaceInfo } from '../marketplace';
import { AppLicenseValidationResult } from '../marketplace/license';
import { Crypto } from '../marketplace/license';

export class AppLicenseManager {
    private readonly crypto: Crypto;
    private readonly userBridge: IUserBridge;
    constructor(private readonly manager: AppManager) {
        this.crypto = new Crypto(this.manager.getBridges().getInternalBridge());
        this.userBridge = this.manager.getBridges().getUserBridge();
    }

    // tslint:disable-next-line: no-empty
    public async validate(validationResult: AppLicenseValidationResult, appMarketplaceInfo?: IMarketplaceInfo): Promise<void> {
        if (!appMarketplaceInfo || !appMarketplaceInfo.subscriptionInfo) {
            return;
        }

        validationResult.setValidated(true);

        const { id: appId, subscriptionInfo } = appMarketplaceInfo;
        // tslint:disable-next-line: max-line-length
        // const encryptedLicense = 'Bj3ZsimHLPBILKhHIl94Rk0Kx6myNWQG8jOwoJVIO8fPAaA9iRol4OhXhRdo14S/Wc8edfGtgeQRxxtSSTU5uwgx4OxSfDU8POOmciTkvkoor4F5smm61K26aYzVEod7x4zm5mLNl8j7IT+nKbyVA3wpecBzznWaeKooCuTv/Z8=';

        let license;
        try {
            license = await this.crypto.decryptLicense(subscriptionInfo.license.license) as any;
        } catch (err) {
            validationResult.addError('publicKey', err.message);

            throw new Error('Invalid license');
        }

        if (license.appId !== appId) {
            validationResult.addError('appId', `License hasn't been issued for this app`);
        }

        const renewal = new Date(license.renewalDate);
        const expire = new Date(license.expireDate);
        const now = new Date();

        if (expire < now) {
            validationResult.addError('expire', 'License is no longer valid');
        }

        const currentActiveUsers = await this.userBridge.getActiveUserCount();

        if (license.maxSeats < currentActiveUsers) {
            validationResult.addError('maxSeats', 'License does not accomodate the currently active users');
        }

        if (validationResult.hasErrors) {
            throw new Error('Invalid license');
        }

        if (renewal < now) {
            validationResult.addWarning('renewal', 'License has expired and needs to be renewed');
        }

        if (license.seats < currentActiveUsers) {
            validationResult.addWarning(
                'seats',
                'License does not accomodateLicense does not accomodate the currently active users. Please expand number of seats',
            );
        }
    }
}
