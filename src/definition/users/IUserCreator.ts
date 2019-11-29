export interface IUserCreator {
    id?: string;
    email: string;
    name: string;
    username: string;
    active?: boolean;
    roles?: Array<string>;
    verified?: boolean;
    joinDefaultChannels?: boolean;
    sendWelcomeEmail?: boolean;
    requirePasswordChange?: boolean;
}
