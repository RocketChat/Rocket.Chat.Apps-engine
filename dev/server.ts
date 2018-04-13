import { AppManager } from '../src/server/AppManager';
import { AppFabricationFulfillment } from '../src/server/compiler';
import { ProxiedApp } from '../src/server/ProxiedApp';
import { DevAppBridges } from './bridges/DevAppBridges';
import { DevAppLogStorage } from './logStorage';
import { TestingStorage } from './storage';

import { App } from '@rocket.chat/apps-ts-definition/App';
import { AppStatusUtils } from '@rocket.chat/apps-ts-definition/AppStatus';
import { IAppInfo } from '@rocket.chat/apps-ts-definition/metadata';
import * as AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';

const logStorage = new DevAppLogStorage();
const storage = new TestingStorage();
const bridges = new DevAppBridges();
const manager = new AppManager(storage, logStorage, bridges);

if (!fs.existsSync('examples')) {
    fs.mkdirSync('examples');
}

function handleAppFabFulfilled(aff: AppFabricationFulfillment): void {
    if (aff.getCompilerErrors().length !== 0) {
        aff.getCompilerErrors().forEach((e) => console.error(e.message));
        console.log(`!!!! Failure due to ${ aff.getCompilerErrors().length } errors !!!!`);
    }
}

async function loader(): Promise<void> {
    const appsLoaded = await manager.load();

    console.log(`!!!! Manager has finished loading ${ appsLoaded.length } Apps !!!!`);

    const files = fs.readdirSync('examples')
                        .filter((file) => file.endsWith('.zip') && fs.statSync(path.join('examples', file)).isFile());

    for (const file of files) {
        const zipBase64 = fs.readFileSync(path.join('examples', file), 'base64');
        const zip = new AdmZip(new Buffer(zipBase64, 'base64'));
        const infoZip = zip.getEntry('app.json');
        let info: IAppInfo;

        if (infoZip && !infoZip.isDirectory) {
            try {
                info = JSON.parse(infoZip.getData().toString()) as IAppInfo;
            } catch (e) {
                throw new Error('Invalid App package. The "app.json" file is not valid json.');
            }
        }

        try {
            if (info && manager.getOneById(info.id)) {
                console.log(`!!!! Updating the App ${ info.name } to v${ info.version } !!!!`);
                handleAppFabFulfilled(await manager.update(zipBase64));
            } else {
                console.log(`!!!! Installing the App ${ info.name } v${ info.version } !!!!`);
                handleAppFabFulfilled(await manager.add(zipBase64));
            }
        } catch (e) {
            console.log('Got an error while working with:', file);
            console.error(e);
            throw e;
        }
    }

    manager.get().forEach((rl: ProxiedApp) => {
        if (AppStatusUtils.isEnabled(rl.getStatus())) {
            console.log(`Successfully loaded: ${ rl.getName() } v${ rl.getVersion() }`);
        } else if (AppStatusUtils.isDisabled(rl.getStatus())) {
            console.log(`Failed to load: ${ rl.getName() } v${ rl.getVersion() }`);
        } else {
            console.log(`Neither failed nor succeeded in loading: ${ rl.getName() } v${ rl.getVersion() }`);
        }
    });
}

loader().then(() => console.log('Completed the loading.')).catch((e) => {
    console.warn('An error ocurred during the loading:');
    console.error(e);
});
