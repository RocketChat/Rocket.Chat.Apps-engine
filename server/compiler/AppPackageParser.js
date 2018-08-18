"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");
const semver = require("semver");
const uuidv4 = require("uuid/v4");
class AppPackageParser {
    constructor() {
        this.allowedIconExts = ['.png', '.jpg', '.jpeg', '.gif'];
        this.appsTsDefVer = this.getTsDefVersion();
    }
    parseZip(compiler, zipBase64) {
        return __awaiter(this, void 0, void 0, function* () {
            const zip = new AdmZip(Buffer.from(zipBase64, 'base64'));
            const infoZip = zip.getEntry('app.json');
            let info;
            if (infoZip && !infoZip.isDirectory) {
                try {
                    info = JSON.parse(infoZip.getData().toString());
                    if (!AppPackageParser.uuid4Regex.test(info.id)) {
                        info.id = uuidv4();
                        console.warn('WARNING: We automatically generated a uuid v4 id for', info.name, 'since it did not provide us an id. This is NOT', 'recommended as the same App can be installed several times.');
                    }
                }
                catch (e) {
                    throw new Error('Invalid App package. The "app.json" file is not valid json.');
                }
            }
            else {
                throw new Error('Invalid App package. No "app.json" file.');
            }
            if (!semver.satisfies(this.appsTsDefVer, info.requiredApiVersion)) {
                throw new errors_1.RequiredApiVersionError(info, this.appsTsDefVer);
            }
            // Load all of the TypeScript only files
            let tsFiles = {};
            zip.getEntries().filter((entry) => entry.entryName.endsWith('.ts') && !entry.isDirectory).forEach((entry) => {
                const norm = path.normalize(entry.entryName);
                // Files which start with `.` are supposed to be hidden
                if (norm.startsWith('.')) {
                    return;
                }
                tsFiles[norm] = {
                    name: norm,
                    content: entry.getData().toString(),
                    version: 0,
                };
            });
            // Ensure that the main class file exists
            if (!tsFiles[path.normalize(info.classFile)]) {
                throw new Error(`Invalid App package. Could not find the classFile (${info.classFile}) file.`);
            }
            const languageContent = this.getLanguageContent(zip);
            // Compile all the typescript files to javascript
            const result = compiler.toJs(info, tsFiles);
            tsFiles = result.files;
            const compiledFiles = {};
            Object.keys(tsFiles).forEach((name) => {
                const norm = path.normalize(name);
                compiledFiles[norm.replace(/\./g, '$')] = tsFiles[norm].compiled;
            });
            // Get the icon's content
            const iconFile = this.getIconFile(zip, info.iconFile);
            if (iconFile) {
                info.iconFileContent = iconFile;
            }
            return {
                info,
                compiledFiles,
                languageContent,
                implemented: result.implemented,
                compilerErrors: result.compilerErrors,
            };
        });
    }
    getLanguageContent(zip) {
        const languageContent = {};
        zip.getEntries().filter((entry) => !entry.isDirectory &&
            entry.entryName.startsWith('i18n/') &&
            entry.entryName.endsWith('.json'))
            .forEach((entry) => {
            const entrySplit = entry.entryName.split('/');
            const lang = entrySplit[entrySplit.length - 1].split('.')[0].toLowerCase();
            let content;
            try {
                content = JSON.parse(entry.getData().toString());
            }
            catch (e) {
                // Failed to parse it, maybe warn them? idk yet
            }
            languageContent[lang] = Object.assign(languageContent[lang] || {}, content);
        });
        return languageContent;
    }
    getIconFile(zip, filePath) {
        if (!filePath) {
            return undefined;
        }
        const ext = path.extname(filePath);
        if (!this.allowedIconExts.includes(ext)) {
            return undefined;
        }
        const entry = zip.getEntry(filePath);
        if (!entry) {
            return undefined;
        }
        if (entry.isDirectory) {
            return undefined;
        }
        const base64 = entry.getData().toString('base64');
        return `data:image/${ext.replace('.', '')};base64,${base64}`;
    }
    getTsDefVersion() {
        const devLocation = path.join(__dirname, '../../../package.json');
        const prodLocation = path.join(__dirname, '../../package.json');
        if (fs.existsSync(devLocation)) {
            const info = JSON.parse(fs.readFileSync(devLocation, 'utf8'));
            return info.version;
        }
        else if (fs.existsSync(prodLocation)) {
            const info = JSON.parse(fs.readFileSync(prodLocation, 'utf8'));
            return info.version;
        }
        else {
            throw new Error('Could not find the Apps TypeScript Definition Package Version!');
        }
    }
}
// tslint:disable-next-line:max-line-length
AppPackageParser.uuid4Regex = /^[0-9a-fA-f]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
exports.AppPackageParser = AppPackageParser;

//# sourceMappingURL=AppPackageParser.js.map
