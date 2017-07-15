import { ProxiedRocketlet } from '../src/server/ProxiedRocketlet';
import { RocketletManager } from '../src/server/RocketletManager';
import { DevRocketletBridges } from './bridges/DevRocketletBridges';
import { TestingStorage } from './storage';

import * as fs from 'fs';
import * as path from 'path';
import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';

const storage = new TestingStorage();
const bridges = new DevRocketletBridges();
const manager = new RocketletManager(storage, bridges);

manager.load().then(() => {
    return Promise.all(fs.readdirSync('examples')
            .filter((file) => file.endsWith('.zip') && fs.statSync(path.join('examples', file)).isFile())
            .map((file) => fs.readFileSync(path.join('examples', file), 'base64'))
            .map((zip) => manager.add(zip).catch((err2: Error) => {
                if (err2.message === 'Rocketlet already exists.') {
                    return manager.update(zip);
                } else {
                    return Promise.reject(err2);
                }
            })));
}).then(() => manager.get().forEach((rl: ProxiedRocketlet) => console.log('Successfully loaded:', rl.getName())))
    .then(() => console.log('Completed the loading.')).catch((err) => console.log('Error caught:', err));
