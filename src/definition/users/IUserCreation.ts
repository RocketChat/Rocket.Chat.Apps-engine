export interface IUserCreation {
    name: string;
    username: string;
    email: string;
    avatarUrl?: string;
    id?: string;
    active?: boolean;
    roles?: Array<string>;
    verified?: boolean;
    joinDefaultChannels?: boolean;
    sendWelcomeEmail?: boolean;
    requirePasswordChange?: boolean;
    setRandomPassword?: boolean;
}
