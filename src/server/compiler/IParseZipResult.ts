import { ProxiedRocketlet } from '../ProxiedRocketlet';

import { IRocketletInfo } from 'temporary-rocketlets-ts-definition/metadata';

export interface IParseZipResult {
    info: IRocketletInfo;
    compiledFiles: { [key: string]: string };
    languageFiles: { [key: string]: string };
}
