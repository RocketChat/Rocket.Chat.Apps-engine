import {
    IEnvironmentalVariableBridge,
    IHttpBridge,
    IMessageBridge,
    IPersistenceBridge,
    IRocketletActivationBridge,
    IRocketletCommandBridge,
    IRoomBridge,
    IServerSettingBridge,
    IUserBridge,
    RocketletBridges,
} from '../../src/server/bridges';
import { DevActivationBridge } from './DevActivationBridge';
import { DevCommandBridge } from './DevCommandBridge';
import { DevEnvironmentalVariableBridge } from './DevEnvironmentalVariableBridge';
import { DevServerSettingBridge } from './DevServerSettingBridge';

export class DevRocketletBridges extends RocketletBridges {
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

    public getCommandBridge(): IRocketletCommandBridge {
        return this.cmdBridge;
    }

    public getServerSettingBridge(): IServerSettingBridge {
        return this.setsBridge;
    }

    public getEnvironmentalVariableBridge(): IEnvironmentalVariableBridge {
        return this.envBridge;
    }

    public getHttpBridge(): IHttpBridge {
        throw new Error('Method not implemented.');
    }

    public getMessageBridge(): IMessageBridge {
        throw new Error('Method not implemented.');
    }

    public getPersistenceBridge(): IPersistenceBridge {
        throw new Error('Method not implemented.');
    }

    public getRocketletActivationBridge(): IRocketletActivationBridge {
        return this.rlActBridge;
    }

    public getRoomBridge(): IRoomBridge {
        throw new Error('Method not implemented.');
    }

    public getUserBridge(): IUserBridge {
        throw new Error('Method not implemented.');
    }
}
