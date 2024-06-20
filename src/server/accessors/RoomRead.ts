import type { IRoomRead } from '../../definition/accessors';
import type { IMessageRaw } from '../../definition/messages';
import type { IRoom } from '../../definition/rooms';
import type { IUser } from '../../definition/users';
import type { RoomBridge } from '../bridges';

export class RoomRead implements IRoomRead {
    constructor(private roomBridge: RoomBridge, private appId: string) {}

    public getById(id: string): Promise<IRoom> {
        return this.roomBridge.doGetById(id, this.appId);
    }

    public getCreatorUserById(id: string): Promise<IUser> {
        return this.roomBridge.doGetCreatorById(id, this.appId);
    }

    public getByName(name: string): Promise<IRoom> {
        return this.roomBridge.doGetByName(name, this.appId);
    }

    public getCreatorUserByName(name: string): Promise<IUser> {
        return this.roomBridge.doGetCreatorByName(name, this.appId);
    }

    public getMessages(
        roomId: string,
        options?: Partial<{
            limit: number;
            skip: number;
            sort: Record<string, 'asc' | 'desc'>;
        }>,
    ): Promise<IMessageRaw[]> {
        const { skip, sort } = options || {};
        let { limit } = options || {};
        // Ensure limit is a finite number; if not, default to 100
        limit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 100;

        const coreSortOptions = this.mapSortParams(sort);

        const adjustedOptions = {
            limit,
            skip,
            sort: coreSortOptions,
        };
        return this.roomBridge.doGetMessages(roomId, adjustedOptions, this.appId);
    }

    public getMembers(roomId: string): Promise<Array<IUser>> {
        return this.roomBridge.doGetMembers(roomId, this.appId);
    }

    public getDirectByUsernames(usernames: Array<string>): Promise<IRoom> {
        return this.roomBridge.doGetDirectByUsernames(usernames, this.appId);
    }

    public getModerators(roomId: string): Promise<Array<IUser>> {
        return this.roomBridge.doGetModerators(roomId, this.appId);
    }

    public getOwners(roomId: string): Promise<Array<IUser>> {
        return this.roomBridge.doGetOwners(roomId, this.appId);
    }

    public getLeaders(roomId: string): Promise<Array<IUser>> {
        return this.roomBridge.doGetLeaders(roomId, this.appId);
    }

    private mapSortParams(userSort?: Record<string, 'asc' | 'desc'>) {
        if (!userSort) return;

        const sortMap: Record<string, string> = {
            createdAt: 'ts',
            updatedAt: '_updatedAt',
        };

        return Object.entries(userSort).reduce((acc, [key, value]) => {
            const mappedKey = sortMap[key];
            if (mappedKey) {
                acc[mappedKey] = value === 'asc' ? 1 : -1;
            }
            return acc;
        }, {} as Record<string, 1 | -1>);
    }
}
