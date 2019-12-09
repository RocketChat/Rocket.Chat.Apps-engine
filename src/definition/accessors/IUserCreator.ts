export interface IUserCreator {
    createAppUser(): Promise<string>;
}
