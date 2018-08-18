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
const metadata_1 = require("../../definition/metadata");
const Utilities_1 = require("../misc/Utilities");
class AppSettingsManager {
    constructor(manager) {
        this.manager = manager;
    }
    getAppSettings(appId) {
        const rl = this.manager.getOneById(appId);
        if (!rl) {
            throw new Error('No App found by the provided id.');
        }
        return Utilities_1.Utilities.deepCloneAndFreeze(rl.getStorageItem().settings);
    }
    getAppSetting(appId, settingId) {
        const settings = this.getAppSettings(appId);
        if (!settings[settingId]) {
            throw new Error('No setting found for the App by the provided id.');
        }
        return Utilities_1.Utilities.deepCloneAndFreeze(settings[settingId]);
    }
    updateAppSetting(appId, setting) {
        return __awaiter(this, void 0, void 0, function* () {
            const rl = this.manager.getOneById(appId);
            if (!rl) {
                throw new Error('No App found by the provided id.');
            }
            if (!rl.getStorageItem().settings[setting.id]) {
                throw new Error('No setting found for the App by the provided id.');
            }
            setting.updatedAt = new Date();
            rl.getStorageItem().settings[setting.id] = setting;
            const item = yield this.manager.getStorage().update(rl.getStorageItem());
            rl.setStorageItem(item);
            this.manager.getBridges().getAppDetailChangesBridge().onAppSettingsChange(appId, setting);
            const configModify = this.manager.getAccessorManager().getConfigurationModify(rl.getID());
            const reader = this.manager.getAccessorManager().getReader(rl.getID());
            const http = this.manager.getAccessorManager().getHttp(rl.getID());
            rl.call(metadata_1.AppMethod.ONSETTINGUPDATED, setting, configModify, reader, http);
        });
    }
}
exports.AppSettingsManager = AppSettingsManager;

//# sourceMappingURL=AppSettingsManager.js.map
