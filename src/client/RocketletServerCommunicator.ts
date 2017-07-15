import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';

export abstract class RocketletServerCommunicator {
    public abstract getEnabledRocketlets(): Promise<Array<Rocketlet>>;
    public abstract getLanguageAdditions(): Promise<Array<Rocketlet>>;
}
