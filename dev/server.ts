import { AppManager } from '../src/server/AppManager';
import { ProxiedApp } from '../src/server/ProxiedApp';
import { DevAppBridges } from './bridges/DevAppBridges';
import { TestingStorage } from './storage';

import { App } from '@rocket.chat/apps-ts-definition/App';
import * as fs from 'fs';
import * as path from 'path';

const storage = new TestingStorage();
const bridges = new DevAppBridges();
const manager = new AppManager(storage, bridges);

if (!fs.existsSync('examples')) {
    fs.mkdirSync('example');
}

manager.load().then(() => {
    return Promise.all(fs.readdirSync('examples')
            .filter((file) => file.endsWith('.zip') && fs.statSync(path.join('examples', file)).isFile())
            .map((file) => fs.readFileSync(path.join('examples', file), 'base64'))
            .map((zip) => manager.add(zip).catch((err2: Error) => {
                if (err2.message === 'App already exists.') {
                    return manager.update(zip);
                } else {
                    return Promise.reject(err2);
                }
            })));
}).then(() => manager.get().forEach((rl: ProxiedApp) => console.log('Successfully loaded:', rl.getName())))
    .then(() => console.log('Completed the loading.')).catch((err) => console.log('Error caught:', err));
