import { RocketletManager } from '../dist/manager';
import { TestingStorage } from './storage';

import * as fs from 'fs';
import * as path from 'path';

const manager = new RocketletManager(new TestingStorage());

fs.readdirSync('examples')
    .filter((file) => file.endsWith('.zip') && fs.statSync(path.join('examples', file)).isFile())
    .map((file) => fs.readFileSync(path.join('examples', file), 'base64'))
    .forEach((zip) => manager.add(zip));

manager.get().forEach((rl) => console.log('Successfully loaded:', rl.getName()));
