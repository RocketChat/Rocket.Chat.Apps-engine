import type { IMessage, IMessageAttachment, IMessageReactions } from '../../definition/messages';
import type { IUser } from '../../definition/users';
import type { AppManager } from '../AppManager';
import { Room } from '../rooms/Room';

export class Message implements IMessage {
	public id?: string;

	public sender: IUser;

	public text?: string;

	public createdAt?: Date;

	public updatedAt?: Date;

	public editor?: IUser;

	public editedAt?: Date;

	public emoji?: string;

	public avatarUrl?: string;

	public alias?: string;

	public attachments?: Array<IMessageAttachment>;

	public reactions?: IMessageReactions;

	public groupable?: boolean;

	public parseUrls?: boolean;

	public customFields?: { [key: string]: any };

	private _ROOM: Room;

	public get room(): Room {
		return this._ROOM;
	}

	public set room(room) {
		this._ROOM = new Room(room, this.manager);
	}

	public constructor(message: IMessage, private manager: AppManager) {
		Object.assign(this, message);
	}
}
