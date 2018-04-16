import {
    AppBridges,
    IAppActivationBridge,
    IAppCommandBridge,
    IAppDetailChangesBridge,
    IEnvironmentalVariableBridge,
    IHttpBridge,
    IListenerBridge,
    IMessageBridge,
    IPersistenceBridge,
    IRoomBridge,
    IServerSettingBridge,
    IUserBridge,
} from '../../src/server/bridges';
import { DevActivationBridge } from './DevActivationBridge';
import { DevCommandBridge } from './DevCommandBridge';
import { DevEnvironmentalVariableBridge } from './DevEnvironmentalVariableBridge';
import { DevHttpBridge } from './DevHttpBridge';
import { DevMessageBridge } from './DevMessageBridge';
import { DevPersisBridge } from './DevPersisBridge';
import { DevRoomBridge } from './DevRoomBridge';
import { DevServerSettingBridge } from './DevServerSettingBridge';
import { DevUserBridge } from './DevUserBridge';

export class DevAppBridges extends AppBridges {
    private readonly cmdBridge: DevCommandBridge;
    private readonly setsBridge: DevServerSettingBridge;
    private readonly envBridge: DevEnvironmentalVariableBridge;
    private readonly rlActBridge: DevActivationBridge;
    private readonly msgBridge: DevMessageBridge;
    private readonly persisBridge: DevPersisBridge;
    private readonly roomBridge: DevRoomBridge;
    private readonly userBridge: DevUserBridge;
    private readonly httpBridge: DevHttpBridge;

    constructor() {
        super();
        this.cmdBridge = new DevCommandBridge();
        this.setsBridge = new DevServerSettingBridge();
        this.envBridge = new DevEnvironmentalVariableBridge();
        this.rlActBridge = new DevActivationBridge();
        this.msgBridge = new DevMessageBridge();
        this.persisBridge = new DevPersisBridge();
        this.roomBridge = new DevRoomBridge();
        this.userBridge = new DevUserBridge();
        this.httpBridge = new DevHttpBridge();
    }

    public getCommandBridge(): IAppCommandBridge {
        return this.cmdBridge;
    }

    public getServerSettingBridge(): IServerSettingBridge {
        return this.setsBridge;
    }

    public getEnvironmentalVariableBridge(): IEnvironmentalVariableBridge {
        return this.envBridge;
    }

    public getAppDetailChangesBridge(): IAppDetailChangesBridge {
        throw new Error('Method not implemented.');
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
