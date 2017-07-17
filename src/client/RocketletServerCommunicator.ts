import { IRocketletInfo } from 'temporary-rocketlets-ts-definition/metadata';

export abstract class RocketletServerCommunicator {
    public abstract getEnabledRocketlets(): Promise<Array<IRocketletInfo>>;
    public abstract getDisabledRocketlets(): Promise<Array<IRocketletInfo>>;
    // Map<rocketletId, Map<language, translations>>
    public abstract getLanguageAdditions(): Promise<Map<string, Map<string, object>>>;
    // Map<rocketletId, Array<commands>>
    public abstract getSlashCommands(): Promise<Map<string, Array<string>>>;
    // Map<rocketletId, Array<to-be-determined>>
    public abstract getContextualBarButtons(): Promise<Map<string, Array<object>>>;
}
