import type { IRoom } from "@rocket.chat/apps-engine/definition/rooms/IRoom.ts";
import type { Room as _Room } from "@rocket.chat/apps-engine/server/rooms/Room.ts";

import { require } from '../lib/require.ts';
import { AppAccessors } from "./accessors/mod.ts";

export const { Room } = require('@rocket.chat/apps-engine/server/rooms/Room.js') as { Room: typeof _Room } ;

const getMockAppManager = (senderFn: AppAccessors['senderFn']) => ({
    getBridges: () => ({
        getInternalBridge: () => ({
            doGetUsernamesOfRoomById: (roomId: string) => {
                senderFn({
                    method: 'bridges:getInternalBridge:doGetUsernamesOfRoomById',
                    params: [roomId],
                });
            },
        }),
    }),
});

export default function createRoom(room: IRoom, senderFn: AppAccessors['senderFn']) {
    const mockAppManager = getMockAppManager(senderFn);

    return new Room(room, mockAppManager);
}
