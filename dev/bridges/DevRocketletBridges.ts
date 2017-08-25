import {
    IEnvironmentalVariableBridge,
    IMessageBridge,
    IPersistenceBridge,
    IRocketletCommandBridge,
    IRoomBridge,
    IServerSettingBridge,
    IUserBridge,
    RocketletBridges,
} from '../../src/server/bridges';
import { DevCommandBridge } from './DevCommandBridge';
import { DevEnvironmentalVariableBridge } from './DevEnvironmentalVariableBridge';
import { DevServerSettingBridge } from './DevServerSettingBridge';

export class DevRocketletBridges extends RocketletBridges {
    private readonly cmdBridge: DevCommandBridge;
    private readonly setsBridge: DevServerSettingBridge;
    private readonly envBridge: DevEnvironmentalVariableBridge;

    constructor() {
        super();
        this.cmdBridge = new DevCommandBridge();
        this.setsBridge = new DevServerSettingBridge();
        this.envBridge = new DevEnvironmentalVariableBridge();
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

    public getMessageBridge(): IMessageBridge {
        throw new Error('Method not implemented.');
    }

    public getPersistenceBridge(): IPersistenceBridge {
        throw new Error('Method not implemented.');
    }

    public getRoomBridge(): IRoomBridge {
        throw new Error('Method not implemented.');
    }

    public getUserBridge(): IUserBridge {
        throw new Error('Method not implemented.');
    }
}
