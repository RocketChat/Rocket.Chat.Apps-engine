import { RocketletCompiler } from './compiler';
import { IGetRocketletsFilter } from './interfaces';
import { RocketletStorage } from './storage';

import * as AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import { IRocketletInfo } from 'temporary-rocketlets-ts-definition/metadata';
import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';
import * as ts from 'typescript';
import * as uuidv4 from 'uuid/v4';
import * as vm from 'vm';

export class RocketletManager {
    // tslint:disable-next-line
    private static uuid4Regex: RegExp = /^[0-9a-fA-f]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    private readonly activeRocketlets: Map<string, Rocketlet>;
    private readonly inactiveRocketlets: Map<string, Rocketlet>;
    private readonly storage: RocketletStorage;
    private readonly compiler: RocketletCompiler;

    constructor(rlStorage: RocketletStorage) {
        this.activeRocketlets = new Map<string, Rocketlet>();
        this.inactiveRocketlets = new Map<string, Rocketlet>();
        this.compiler = new RocketletCompiler();

        if (rlStorage instanceof RocketletStorage) {
            this.storage = rlStorage;
        } else {
            throw new Error('Invalid instance of the RocketletStorage.');
        }

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

                if (!RocketletManager.uuid4Regex.test(info.id)) {
                    info.id = uuidv4();
                    console.log(info.name, 'is being assigned the id:', info.id);
                }
            } catch (e) {
                throw new Error('Invalid Rocketlet package. The "rocketlet.json" file is not valid json.');
            }
        } else {
            throw new Error('Invalid Rocketlet package. No "rocketlet.json" file.');
        }

        const mainZip = zip.getEntry(info.classFile);

        if (mainZip && !mainZip.isDirectory) {
            const js = this.getCompiler().toJs(info, mainZip.getData().toString());
            rocketlet = this.getCompiler().toSandBox(info, js);
        } else {
            throw new Error(`Invalid Rocketlet package. Could not find the classFile (${info.classFile}) file.`);
        }

        this.activeRocketlets.set(info.id, rocketlet);
        return rocketlet;
    }

    public remove(id: string): Rocketlet {
        throw new Error('Not implemented nor architected.');
    }
}
