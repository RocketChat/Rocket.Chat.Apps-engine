import { publicDecrypt } from 'crypto';
import { IServerSettingBridge } from '../../bridges';

const publicKeySettingName = 'Cloud_Workspace_PublicKey';
export class Crypto {
    constructor(private readonly settingsBridge: IServerSettingBridge) {}

    public async decryptLicense(content: string, appId: string): Promise<object> {
        const publicKeySetting = await this.settingsBridge.getOneById(publicKeySettingName, appId);

        if (!publicKeySetting || !publicKeySetting.value) {
            throw new Error('Public key not available, cannot decrypt'); // TODO: add custom error?
        }

        const decoded = publicDecrypt(Buffer.from(publicKeySetting.value, 'base64'), Buffer.from(content, 'base64'));

        let license;
        try {
            license = JSON.parse(decoded.toString());
        } catch (error) {
            throw new Error('Invalid license provided');
        }

        return license;
     }
}
