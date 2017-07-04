import { RocketletCompiler } from './compiler';
import { IGetRocketletsFilter } from './interfaces';

import * as AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';
import * as ts from 'typescript';
import * as vm from 'vm';

export class RocketletManager {
    private readonly activeRocketlets: Map<number, Rocketlet>;
    private readonly inactiveRocketlets: Map<number, Rocketlet>;
    private readonly compiler: RocketletCompiler;

    constructor() {
        this.activeRocketlets = new Map<number, Rocketlet>();
        this.inactiveRocketlets = new Map<number, Rocketlet>();
        this.compiler = new RocketletCompiler();
        console.log('Constructed the RocketletManager.');
    }

    public getCompiler(): RocketletCompiler {
        return this.compiler;
    }

    public load(): Promise<Array<Rocketlet>> {
        throw new Error('Not implemented yet.');
    }

    public get(filter: IGetRocketletsFilter): Array<Rocketlet> {
        throw new Error('Not implemented yet.');
    }

    public enable(id: number): boolean {
        throw new Error('Not implemented yet.');
    }

    public disable(id: number): boolean {
        throw new Error('Not implemented yet.');
    }

    public add(zipContentsBase64d: string): Rocketlet {
        const zip = new AdmZip(new Buffer(zipContentsBase64d, 'base64'));

        console.log(zip.getEntries());

        throw new Error('Not implemented yet.');
    }

    public remove(id: number): Rocketlet {
        throw new Error('Not implemented nor architected.');
    }
}
