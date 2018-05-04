// tslint:disable:max-classes-per-file
import { IMessage } from '@rocket.chat/apps-ts-definition/messages';
import { IRoom, RoomType } from '@rocket.chat/apps-ts-definition/rooms';
import { ISetting, SettingType } from '@rocket.chat/apps-ts-definition/settings';
import { IUser, UserStatusConnection, UserType } from '@rocket.chat/apps-ts-definition/users';

import { TestsAppBridges } from './bridges/appBridges';
import { TestsAppLogStorage } from './logStorage';
import { TestsAppStorage } from './storage';

import { AppBridges } from '../../src/server/bridges';
import { AppLogStorage, AppStorage } from '../../src/server/storage';

export class TestInfastructureSetup {
    private appStorage: TestsAppStorage;
    private logStorage: TestsAppLogStorage;
    private bridges: TestsAppBridges;

    constructor() {
        this.appStorage = new TestsAppStorage();
        this.logStorage = new TestsAppLogStorage();
        this.bridges = new TestsAppBridges();
    }

    public getAppStorage(): AppStorage {
        return this.appStorage;
    }

    public getLogStorage(): AppLogStorage {
        return this.logStorage;
    }

    public getAppBridges(): AppBridges {
        return this.bridges;
    }
}

const date = new Date();
export class TestData {
    public static getDate(): Date {
        return date;
    }

    public static getSetting(id?: string): ISetting {
        return {
            id: id ? id : 'testing',
            type: SettingType.STRING,
            packageValue: 'The packageValue',
            required: false,
            public: false,
            i18nLabel: 'Testing',
        };
    }

    public static getUser(id?: string, username?: string): IUser {
        return {
            id: id ? id : 'BBxwgCBzLeMC6esTb',
            username: username ? username : 'testing-user',
            name: 'Testing User',
            emails: [],
            type: UserType.USER,
            isEnabled: true,
            roles: ['admin'],
            status: 'online',
            statusConnection: UserStatusConnection.ONLINE,
            utcOffset: -5,
            createdAt: date,
            updatedAt: new Date(),
            lastLoginAt: new Date(),
        };
    }

    public static getRoom(id?: string, slugifiedName?: string): IRoom {
        return {
            id: id ? id : 'bTse6CMeLzBCgwxBB',
            slugifiedName: slugifiedName ? slugifiedName : 'testing-room',
            displayName: 'Testing Room',
            type: RoomType.CHANNEL,
            creator: TestData.getUser(),
            usernames: [TestData.getUser().username],
            isDefault: true,
            isReadOnly: false,
            displaySystemMessages: true,
            messageCount: 145,
            createdAt: date,
            updatedAt: new Date(),
            lastModifiedAt: new Date(),
        };
    }

    public static getMessage(id?: string, text?: string): IMessage {
        return {
            id: id ? id : '4bShvoOXqB',
            room: TestData.getRoom(),
            sender: TestData.getUser(),
            text: 'This is just a test, do not be alarmed',
            createdAt: date,
            updatedAt: new Date(),
            editor: TestData.getUser(),
            editedAt: new Date(),
            emoji: ':see_no_evil:',
            avatarUrl: 'https://avatars0.githubusercontent.com/u/850391?s=88&v=4',
            alias: 'Testing Bot',
            attachments: [{
                collapsed: false,
                color: '#00b2b2',
                text: 'Just an attachment that is used for testing',
                timestamp: new Date(),
                timestampLink: 'https://google.com/',
                thumbnailUrl: 'https://avatars0.githubusercontent.com/u/850391?s=88&v=4',
                author: {
                    name: 'Author Name',
                    link: 'https://github.com/graywolf336',
                    icon: 'https://avatars0.githubusercontent.com/u/850391?s=88&v=4',
                },
                title: {
                    value: 'Attachment Title',
                    link: 'https://github.com/RocketChat',
                    displayDownloadLink: false,
                },
                imageUrl: 'https://rocket.chat/images/default/logo.svg',
                audioUrl: 'http://www.w3schools.com/tags/horse.mp3',
                videoUrl: 'http://www.w3schools.com/tags/movie.mp4',
                fields: [
                    {
                        short: true,
                        title: 'Test',
                        value: 'Testing out something or other',
                    },
                    {
                        short: true,
                        title: 'Another Test',
                        value: '[Link](https://google.com/) something and this and that.',
                    },
                ],
            }],
        };
    }
}

export class SimpleClass {
    private readonly world: string;
    constructor(world = 'Earith') {
        this.world = world;
    }

    public getWorld(): string {
        return this.world;
    }
}
