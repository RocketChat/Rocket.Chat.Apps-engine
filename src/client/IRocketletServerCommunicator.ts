import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';

export abstract class IRocketletServerCommunicator {
    public abstract getEnabledRocketlets(): Promise<Array<Rocketlet>>;
}
