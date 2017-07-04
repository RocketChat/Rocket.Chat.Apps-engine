import { RocketletCompiler } from './compiler';
import { IGetRocketletsFilter } from './interfaces';

import * as AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import { IRocketletInfo } from 'temporary-rocketlets-ts-definition/metadata/IRocketletInfo';
import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';
import * as ts from 'typescript';
import * as vm from 'vm';

export class RocketletManager {
    private readonly activeRocketlets: Map<string, Rocketlet>;
    private readonly inactiveRocketlets: Map<string, Rocketlet>;
    private readonly compiler: RocketletCompiler;

    constructor() {
        this.activeRocketlets = new Map<string, Rocketlet>();
        this.inactiveRocketlets = new Map<string, Rocketlet>();
        this.compiler = new RocketletCompiler();
        console.log('Constructed the RocketletManager.');
    }

    public getCompiler(): RocketletCompiler {
        return this.compiler;
    }

    public load(): Promise<Array<Rocketlet>> {
        throw new Error('Not implemented yet.');
    }

    public get(filter?: IGetRocketletsFilter): Array<Rocketlet> {
        if (filter) {
            console.warn('The filter is not yet implemented.');
        }

        const rls = new Array<Rocketlet>();
        this.activeRocketlets.forEach((rc, id) => rls.push(rc));
        this.inactiveRocketlets.forEach((rc, id) => rls.push(rc));

        return rls;
    }

    public enable(id: string): boolean {
        throw new Error('Not implemented yet.');
    }

    public disable(id: string): boolean {
        throw new Error('Not implemented yet.');
    }

    public add(zipContentsBase64d: string): Rocketlet {
        const zip = new AdmZip(new Buffer(zipContentsBase64d, 'base64'));
        const infoZip = zip.getEntry('rocketlet.json');
        let info: IRocketletInfo;
        let rocketlet: Rocketlet;

        if (infoZip && !infoZip.isDirectory) {
            try {
                info = JSON.parse(infoZip.getData().toString()) as IRocketletInfo;
            } catch (e) {
                throw new Error('Invalid Rocketlet package. The "rocketlet.json" file is not valid json.');
            }
        } else {
            throw new Error('Invalid Rocketlet package. No "rocketlet.json" file.');
        }

        console.log('Loading:', info.name);

        const mainZip = zip.getEntry(info.classFile);

        if (mainZip && !mainZip.isDirectory) {
            const js = this.getCompiler().toJs(info, mainZip.getData().toString());
            rocketlet = this.getCompiler().toSandBox(info, js);
        } else {
            throw new Error(`Invalid Rocketlet package. Could not find the classFile (${info.classFile}) file.`);
        }

        this.activeRocketlets.set('thing', rocketlet);
        return rocketlet;
    }

    public remove(id: string): Rocketlet {
        throw new Error('Not implemented nor architected.');
    }
}
