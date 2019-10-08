import * as semver from 'semver';
import { IAppInfo } from '../../definition/metadata';

export class RequiredApiVersionError implements Error {
    public name: string = 'RequiredApiVersion';
    public message: string;

    constructor(info: IAppInfo, versionInstalled: string) {
        let moreInfo: string = '';
        if (semver.gt(versionInstalled, info.requiredApiVersion)) {
            moreInfo = ' Please tell the author to update their App as it is out of date.';
        }

        this.message = `Failed to load the App "${info.name}" (${info.id}) as it requires ` +
            `v${info.requiredApiVersion} of the App API however your server comes with ` +
            `v${versionInstalled}.${moreInfo}`;
    }
}
