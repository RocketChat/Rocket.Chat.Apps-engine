import * as semver from 'semver';
import { IRocketletInfo } from 'temporary-rocketlets-ts-definition/metadata';

export class RequiredApiVersionError implements Error {
    public name: string = 'RequiredApiVersion';
    public message: string;

    constructor(info: IRocketletInfo, versionInstalled: string) {
        let moreInfo: string = '';
        if (semver.gt(versionInstalled, info.requiredApiVersion)) {
            moreInfo = ' Please tell the author to update their Rocketlet as it is out of date.';
        }

        this.message = `Failed to load the Rocketlet "${info.name}" (${info.id}) as it requires ` +
            `v${info.requiredApiVersion} of the Rocketlet API however your server comes with ` +
            `v${versionInstalled}.${moreInfo}`;
    }
}
