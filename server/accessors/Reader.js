"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Reader {
    constructor(env, message, persist, room, user, noti) {
        this.env = env;
        this.message = message;
        this.persist = persist;
        this.room = room;
        this.user = user;
        this.noti = noti;
    }
    getEnvironmentReader() {
        return this.env;
    }
    getMessageReader() {
        return this.message;
    }
    getPersistenceReader() {
        return this.persist;
    }
    getRoomReader() {
        return this.room;
    }
    getUserReader() {
        return this.user;
    }
    getNotifier() {
        return this.noti;
    }
}
exports.Reader = Reader;

//# sourceMappingURL=Reader.js.map
