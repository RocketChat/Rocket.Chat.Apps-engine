import { RocketletCompiler } from './compiler';
import { IGetRocketletsFilter } from './interfaces';
import { IRocketletStorageItem, RocketletStorage } from './storage';

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
        return this.storage.retrieveAll().then((items: Array<IRocketletStorageItem>) => {
            return items.map((item: IRocketletStorageItem) => {
                return this.getCompiler().toSandBox(item.info, item.compiled);
            });
        }).then((rcs: Array<Rocketlet>) => {
            return rcs.map((rc: Rocketlet) => {
                this.activeRocketlets.set(rc.getID(), rc);
                return rc;
            });
        });
    }

    public loadOne(id: string): Promise<Rocketlet> {
        return new Promise((resolve, reject) => {
            reject(new Error('Not implemented yet.'));
        });
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

    public add(zipContentsBase64d: string): Promise<Rocketlet> {
        return new Promise((resolve, reject) => {
            const zip = new AdmZip(new Buffer(zipContentsBase64d, 'base64'));
            const infoZip = zip.getEntry('rocketlet.json');
            let info: IRocketletInfo;
            let compiledJs: string;
            let rocketlet: Rocketlet;

            if (infoZip && !infoZip.isDirectory) {
                try {
                    info = JSON.parse(infoZip.getData().toString()) as IRocketletInfo;

                    if (!RocketletManager.uuid4Regex.test(info.id)) {
                        info.id = uuidv4();
                        console.log(info.name, 'is being assigned the id:', info.id);
                    }
                } catch (e) {
                    reject(new Error('Invalid Rocketlet package. The "rocketlet.json" file is not valid json.'));
                    return;
                }
            } else {
                reject(new Error('Invalid Rocketlet package. No "rocketlet.json" file.'));
                return;
            }

            const mainZip = zip.getEntry(info.classFile);

            if (mainZip && !mainZip.isDirectory) {
                compiledJs = this.getCompiler().toJs(info, mainZip.getData().toString());
                rocketlet = this.getCompiler().toSandBox(info, compiledJs);
            } else {
                reject(new Error(`Invalid Rocketlet package. Could not find the classFile (${info.classFile}) file.`));
                return;
            }

            this.storage.create({
                id: info.id,
                info,
                zip: zipContentsBase64d,
                compiled: compiledJs,
            }).then((item: IRocketletStorageItem) => {
                this.activeRocketlets.set(info.id, rocketlet);
                resolve(rocketlet);
            }).catch((err: Error) => reject(err));
        });
    }

    public remove(id: string): Rocketlet {
        throw new Error('Not implemented nor architected.');
    }
}
