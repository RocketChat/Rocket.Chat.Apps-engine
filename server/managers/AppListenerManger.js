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
const accessors_1 = require("../accessors");
const compiler_1 = require("../compiler");
const metadata_1 = require("../../definition/metadata");
const Utilities_1 = require("../misc/Utilities");
class AppListenerManger {
    constructor(manager) {
        this.manager = manager;
        this.am = manager.getAccessorManager();
        this.listeners = new Map();
        Object.keys(compiler_1.AppInterface).forEach((intt) => this.listeners.set(intt, new Array()));
    }
    registerListeners(app) {
        const impleList = app.getImplementationList();
        for (const int in app.getImplementationList()) {
            if (impleList[int]) {
                this.listeners.get(int).push(app.getID());
            }
        }
    }
    unregisterListeners(app) {
        this.listeners.forEach((apps, int) => {
            if (apps.includes(app.getID())) {
                const where = apps.indexOf(app.getID());
                this.listeners.get(int).splice(where, 1);
            }
        });
    }
    getListeners(int) {
        const results = new Array();
        for (const appId of this.listeners.get(int)) {
            results.push(this.manager.getOneById(appId));
        }
        return results;
    }
    // tslint:disable-next-line
    executeListener(int, data) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (int) {
                // Messages
                case compiler_1.AppInterface.IPreMessageSentPrevent:
                    return this.executePreMessageSentPrevent(data);
                case compiler_1.AppInterface.IPreMessageSentExtend:
                    return this.executePreMessageSentExtend(data);
                case compiler_1.AppInterface.IPreMessageSentModify:
                    return this.executePreMessageSentModify(data);
                case compiler_1.AppInterface.IPostMessageSent:
                    this.executePostMessageSent(data);
                    return;
                case compiler_1.AppInterface.IPreMessageDeletePrevent:
                    return this.executePreMessageDeletePrevent(data);
                case compiler_1.AppInterface.IPostMessageDeleted:
                    this.executePostMessageDelete(data);
                    return;
                // Rooms
                case compiler_1.AppInterface.IPreRoomCreatePrevent:
                    return this.executePreRoomCreatePrevent(data);
                case compiler_1.AppInterface.IPreRoomCreateExtend:
                    return this.executePreRoomCreateExtend(data);
                case compiler_1.AppInterface.IPreRoomCreateModify:
                    return this.executePreRoomCreateModify(data);
                case compiler_1.AppInterface.IPostRoomCreate:
                    this.executePostRoomCreate(data);
                    return;
                case compiler_1.AppInterface.IPreRoomDeletePrevent:
                    return this.executePreRoomDeletePrevent(data);
                case compiler_1.AppInterface.IPostRoomDeleted:
                    this.executePostRoomDeleted(data);
                    return;
                default:
                    console.warn('Unimplemented (or invalid) AppInterface was just tried to execute.');
                    return;
            }
        });
    }
    // Messages
    executePreMessageSentPrevent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let prevented = false;
            const cfMsg = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(compiler_1.AppInterface.IPreMessageSentPrevent)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREMESSAGESENTPREVENT)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREMESSAGESENTPREVENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREMESSAGESENTPREVENT)) {
                    prevented = (yield app.call(metadata_1.AppMethod.EXECUTEPREMESSAGESENTPREVENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId)));
                    if (prevented) {
                        return prevented;
                    }
                }
            }
            return prevented;
        });
    }
    executePreMessageSentExtend(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = data;
            const cfMsg = Utilities_1.Utilities.deepCloneAndFreeze(msg);
            for (const appId of this.listeners.get(compiler_1.AppInterface.IPreMessageSentExtend)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREMESSAGESENTEXTEND)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREMESSAGESENTEXTEND, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREMESSAGESENTEXTEND)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPREMESSAGESENTEXTEND, cfMsg, new accessors_1.MessageExtender(msg), // This mutates the passed in object
                    this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
            return msg;
        });
    }
    executePreMessageSentModify(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let msg = data;
            const cfMsg = Utilities_1.Utilities.deepCloneAndFreeze(msg);
            for (const appId of this.listeners.get(compiler_1.AppInterface.IPreMessageSentModify)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREMESSAGESENTMODIFY)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREMESSAGESENTMODIFY, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREMESSAGESENTMODIFY)) {
                    msg = (yield app.call(metadata_1.AppMethod.EXECUTEPREMESSAGESENTMODIFY, cfMsg, new accessors_1.MessageBuilder(msg), this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId)));
                }
            }
            return data;
        });
    }
    executePostMessageSent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfMsg = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(compiler_1.AppInterface.IPostMessageSent)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPOSTMESSAGESENT)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPOSTMESSAGESENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPOSTMESSAGESENT)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPOSTMESSAGESENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
        });
    }
    executePreMessageDeletePrevent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let prevented = false;
            const cfMsg = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(compiler_1.AppInterface.IPreMessageDeletePrevent)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREMESSAGEDELETEPREVENT)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREMESSAGEDELETEPREVENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREMESSAGEDELETEPREVENT)) {
                    prevented = (yield app.call(metadata_1.AppMethod.EXECUTEPREMESSAGEDELETEPREVENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId)));
                    if (prevented) {
                        return prevented;
                    }
                }
            }
            return prevented;
        });
    }
    executePostMessageDelete(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfMsg = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(compiler_1.AppInterface.IPostMessageDeleted)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPOSTMESSAGEDELETED)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPOSTMESSAGEDELETED, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPOSTMESSAGEDELETED)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPOSTMESSAGEDELETED, cfMsg, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
        });
    }
    // Rooms
    executePreRoomCreatePrevent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfRoom = Utilities_1.Utilities.deepCloneAndFreeze(data);
            let prevented = false;
            for (const appId of this.listeners.get(compiler_1.AppInterface.IPreRoomCreatePrevent)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREROOMCREATEPREVENT)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREROOMCREATEPREVENT, cfRoom, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREROOMCREATEPREVENT)) {
                    prevented = (yield app.call(metadata_1.AppMethod.EXECUTEPREROOMCREATEPREVENT, cfRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId)));
                    if (prevented) {
                        return prevented;
                    }
                }
            }
            return prevented;
        });
    }
    executePreRoomCreateExtend(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = data;
            const cfRoom = Utilities_1.Utilities.deepCloneAndFreeze(room);
            for (const appId of this.listeners.get(compiler_1.AppInterface.IPreRoomCreateExtend)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREROOMCREATEEXTEND)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREROOMCREATEEXTEND, cfRoom, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREROOMCREATEEXTEND)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPREROOMCREATEEXTEND, cfRoom, new accessors_1.RoomExtender(room), // This mutates the passed in object
                    this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
            return data;
        });
    }
    executePreRoomCreateModify(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let room = data;
            const cfRoom = Utilities_1.Utilities.deepCloneAndFreeze(room);
            for (const appId of this.listeners.get(compiler_1.AppInterface.IPreRoomCreateModify)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREROOMCREATEMODIFY)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREROOMCREATEMODIFY, cfRoom, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREROOMCREATEMODIFY)) {
                    room = (yield app.call(metadata_1.AppMethod.EXECUTEPREROOMCREATEMODIFY, cfRoom, new accessors_1.RoomBuilder(room), this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId)));
                }
            }
            return data;
        });
    }
    executePostRoomCreate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfRoom = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(compiler_1.AppInterface.IPostRoomCreate)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPOSTROOMCREATE)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPOSTROOMCREATE, cfRoom, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPOSTROOMCREATE)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPOSTROOMCREATE, cfRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
        });
    }
    executePreRoomDeletePrevent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfRoom = Utilities_1.Utilities.deepCloneAndFreeze(data);
            let prevented = false;
            for (const appId of this.listeners.get(compiler_1.AppInterface.IPreRoomDeletePrevent)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREROOMDELETEPREVENT)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREROOMDELETEPREVENT, cfRoom, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREROOMDELETEPREVENT)) {
                    prevented = (yield app.call(metadata_1.AppMethod.EXECUTEPREROOMDELETEPREVENT, cfRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId)));
                    if (prevented) {
                        return prevented;
                    }
                }
            }
            return prevented;
        });
    }
    executePostRoomDeleted(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfRoom = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(compiler_1.AppInterface.IPostRoomDeleted)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPOSTROOMDELETED)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPOSTROOMDELETED, cfRoom, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPOSTROOMDELETED)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPOSTROOMDELETED, cfRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
        });
    }
}
exports.AppListenerManger = AppListenerManger;

//# sourceMappingURL=AppListenerManger.js.map
