import { RocketletManager } from '../src/manager';
import { IRocketletStorageItem } from '../src/storage/IRocketletStorageItem';
import { TestingStorage } from './storage';

import * as fs from 'fs';
import * as path from 'path';

const storage = new TestingStorage();
const manager = new RocketletManager(storage);

storage.retrieveAll().then((items: Array<IRocketletStorageItem>) => {
    if (items.length === 0) {
        throw new Error('No items.');
    } else {
        return manager.load();
    }
}).catch((err: Error) => {
    if (err.message === 'No items.') {
        return Promise.all(fs.readdirSync('examples')
                .filter((file) => file.endsWith('.zip') && fs.statSync(path.join('examples', file)).isFile())
                .map((file) => fs.readFileSync(path.join('examples', file), 'base64'))
                .map((zip) => manager.add(zip)));
    } else {
        console.error(err);
    }
}).then(() => manager.get().forEach((rl) => console.log('Successfully loaded:', rl.getName())));
