import { IRocketletInfo } from 'temporary-rocketlets-ts-definition/metadata';
import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';

export interface IParseZipResult {
    info: IRocketletInfo;
    compiledFiles: { [s: string]: string };
    rocketlet: Rocketlet;
}
