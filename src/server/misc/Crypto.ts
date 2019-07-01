import { publicDecrypt } from 'crypto';
import { IServerSettingBridge } from '../bridges';

const publicKeySettingName = 'Cloud_Workspace_PublicKey';
export class Crypto {
    constructor(private readonly settingsBridge: IServerSettingBridge) {}

    public async decryptLicense(content: string, appId: string): Promise<object> {
        const publicKey = await this.settingsBridge.getOneById(publicKeySettingName, appId);

        if (!publicKey || !publicKey.value) {
            throw new Error('Public key not available, cannot decrypt'); // TODO: add custom error?
        }

        const decoded = publicDecrypt(publicKey.value, Buffer.from(content));

        let license;
        try {
            license = JSON.parse(decoded.toString());
        } catch (error) {
            throw new Error('Invalid license provided');
        }

        return license;
     }
}
