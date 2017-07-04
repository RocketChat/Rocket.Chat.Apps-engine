const fs = require('fs');
const path = require('path');
const rl = require('./dist');

class TestingStorage extends rl.RocketletStorage {
    create() {
        console.log('Create called:', arguments);
    }

    retrieveOne() {
        console.log('Retrieve One called:', arguments);
    }

    retrieveAll() {
        console.log('retrieveAll called:', arguments);
    }

    update() {
        console.log('Update called:', arguments);
    }

    remove() {
        console.log('Remove called:', arguments);
    }
}

const rlm = new rl.RocketletManager(new TestingStorage());

fs.readdirSync('examples')
    .filter((file) => file.endsWith('.zip') && fs.statSync(path.join('examples', file)).isFile())
    .map((file) => fs.readFileSync(path.join('examples', file), 'base64'))
    .forEach((zip) => rlm.add(zip));

rlm.get().forEach((rl) => console.log('Successfully loaded:', rl.getName()));
