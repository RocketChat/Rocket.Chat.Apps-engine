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
import { DevServerSettingBridge } from './DevServerSettingBridge';

export class DevAppBridges extends AppBridges {
    private readonly cmdBridge: DevCommandBridge;
    private readonly setsBridge: DevServerSettingBridge;
    private readonly envBridge: DevEnvironmentalVariableBridge;
    private readonly rlActBridge: DevActivationBridge;

    constructor() {
        super();
        this.cmdBridge = new DevCommandBridge();
        this.setsBridge = new DevServerSettingBridge();
        this.envBridge = new DevEnvironmentalVariableBridge();
        this.rlActBridge = new DevActivationBridge();
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
        throw new Error('Method not implemented.');
    }

    public getListenerBridge(): IListenerBridge {
        throw new Error('Method not implemented.');
    }

    public getMessageBridge(): IMessageBridge {
        throw new Error('Method not implemented.');
    }

    public getPersistenceBridge(): IPersistenceBridge {
        throw new Error('Method not implemented.');
    }

    public getAppActivationBridge(): IAppActivationBridge {
        return this.rlActBridge;
    }

    public getRoomBridge(): IRoomBridge {
        throw new Error('Method not implemented.');
    }

    public getUserBridge(): IUserBridge {
        throw new Error('Method not implemented.');
    }
}
