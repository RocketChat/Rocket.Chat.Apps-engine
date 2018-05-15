import {
    AppBridges,
    IAppActivationBridge,
    IAppDetailChangesBridge,
    IEnvironmentalVariableBridge,
    IHttpBridge,
    IListenerBridge,
    IMessageBridge,
    IPersistenceBridge,
    IRoomBridge,
    IServerSettingBridge,
    IUserBridge,
} from '../../../src/server/bridges';
import { TestsActivationBridge } from './activationBridge';
import { TestsAppDetailChangesBridge } from './appDetailChanges';
import { TestsCommandBridge } from './commandBridge';
import { TestsEnvironmentalVariableBridge } from './environmentalVariableBridge';
import { TestsHttpBridge } from './httpBridge';
import { TestsMessageBridge } from './messageBridge';
import { TestsPersisBridge } from './persisBridge';
import { TestsRoomBridge } from './roomBridge';
import { TestsServerSettingBridge } from './serverSettingBridge';
import { TestsUserBridge } from './userBridge';

export class TestsAppBridges extends AppBridges {
    private readonly appDetails: TestsAppDetailChangesBridge;
    private readonly cmdBridge: TestsCommandBridge;
    private readonly setsBridge: TestsServerSettingBridge;
    private readonly envBridge: TestsEnvironmentalVariableBridge;
    private readonly rlActBridge: TestsActivationBridge;
    private readonly msgBridge: TestsMessageBridge;
    private readonly persisBridge: TestsPersisBridge;
    private readonly roomBridge: TestsRoomBridge;
    private readonly userBridge: TestsUserBridge;
    private readonly httpBridge: TestsHttpBridge;

    constructor() {
        super();
        this.appDetails = new TestsAppDetailChangesBridge();
        this.cmdBridge = new TestsCommandBridge();
        this.setsBridge = new TestsServerSettingBridge();
        this.envBridge = new TestsEnvironmentalVariableBridge();
        this.rlActBridge = new TestsActivationBridge();
        this.msgBridge = new TestsMessageBridge();
        this.persisBridge = new TestsPersisBridge();
        this.roomBridge = new TestsRoomBridge();
        this.userBridge = new TestsUserBridge();
        this.httpBridge = new TestsHttpBridge();
    }

    public getCommandBridge(): TestsCommandBridge {
        return this.cmdBridge;
    }

    public getServerSettingBridge(): IServerSettingBridge {
        return this.setsBridge;
    }

    public getEnvironmentalVariableBridge(): IEnvironmentalVariableBridge {
        return this.envBridge;
    }

    public getAppDetailChangesBridge(): IAppDetailChangesBridge {
        return this.appDetails;
    }

    public getHttpBridge(): IHttpBridge {
        return this.httpBridge;
    }

    public getListenerBridge(): IListenerBridge {
        throw new Error('Method not implemented.');
    }

    public getMessageBridge(): IMessageBridge {
        return this.msgBridge;
    }

    public getPersistenceBridge(): IPersistenceBridge {
        return this.persisBridge;
    }

    public getAppActivationBridge(): IAppActivationBridge {
        return this.rlActBridge;
    }

    public getRoomBridge(): IRoomBridge {
        return this.roomBridge;
    }

    public getUserBridge(): IUserBridge {
        return this.userBridge;
    }
}
