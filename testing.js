const fs = require('fs');
const path = require('path');
const rl = require('./dist');

const rlm = new rl.RocketletManager();

fs.readdirSync('examples')
    .filter((file) => file.endsWith('.zip') && fs.statSync(path.join('examples', file)).isFile())
    .map((file) => fs.readFileSync(path.join('examples', file), 'base64'))
    .forEach((zip) => rlm.add(zip));

rlm.get({ enabled: true }).forEach((rl) => console.log(rl.getName()));
