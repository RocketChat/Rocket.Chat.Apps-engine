import { AppManager } from '../src/server/AppManager';
import { ProxiedApp } from '../src/server/ProxiedApp';
import { DevAppBridges } from './bridges/DevAppBridges';
import { DevAppLogStorage } from './logStorage';
import { TestingStorage } from './storage';

import { App } from '@rocket.chat/apps-ts-definition/App';
import * as fs from 'fs';
import * as path from 'path';

const logStorage = new DevAppLogStorage();
const storage = new TestingStorage();
const bridges = new DevAppBridges();
const manager = new AppManager(storage, logStorage, bridges);

if (!fs.existsSync('examples')) {
    fs.mkdirSync('examples');
}

async function loader(): Promise<void> {
    await manager.load();

    const files = fs.readdirSync('examples')
                        .filter((file) => file.endsWith('.zip') && fs.statSync(path.join('examples', file)).isFile());

    for (const file of files) {
        const zip = fs.readFileSync(path.join('examples', file), 'base64');

        try {
            await manager.add(zip);
        } catch (e) {
            if (e.message === 'App already exists.') {
                await manager.update(zip);
                continue;
            }

            console.log('Got an error while working with:', file);
            throw e;
        }
    }

    manager.get().forEach((rl: ProxiedApp) => console.log('Successfully loaded:', rl.getName()));
}

loader().then(() => console.log('Completed the loading.'));
