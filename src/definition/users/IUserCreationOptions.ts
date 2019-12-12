export interface IUserCreationOptions {
    avatarUrl?: string;
    active?: boolean;
    joinDefaultChannels?: boolean;
    verified?: boolean;
    requirePasswordChange?: boolean;
    sendWelcomeEmail?: boolean;
}
