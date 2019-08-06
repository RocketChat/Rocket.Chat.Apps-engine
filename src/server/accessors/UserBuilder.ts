import { IUserBuilder } from '../../definition/accessors';
import { RocketChatAssociationModel } from '../../definition/metadata';
import { IUserGenerate } from '../../definition/users';

export class UserBuilder implements IUserBuilder {
    public kind: RocketChatAssociationModel.USER;

    private user: IUserGenerate;

    constructor(user?: IUserGenerate) {
        this.kind = RocketChatAssociationModel.USER;
        this.user = user ? user : ({} as IUserGenerate);
    }

    public setData(data: IUserGenerate): IUserBuilder {
        delete data.id;
        this.user = data;

        return this;
    }

    public setEmail(email: string): IUserBuilder {
        this.user.email = email;
        return this;
    }

    public getEmail(): string {
        return this.user.email;
    }

    public setDisplayName(name: string): IUserBuilder {
        this.user.name = name;
        return this;
    }

    public getDisplayName(): string {
        return this.user.name;
    }

    public setUsername(username: string): IUserBuilder {
        this.user.username = username;
        return this;
    }

    public getUsername(): string {
        return this.user.username;
    }

    public setRoles(roles: Array<string>): IUserBuilder {
        this.user.roles = roles;
        return this;
    }

    public getRoles(): Array<string> {
        return this.user.roles;
    }

    public setActive(active: boolean): IUserBuilder {
        this.user.active = active;
        return this;
    }

    public getActive(): boolean {
        return this.user.active;
    }

    public setJoinDefaultChannels(join: boolean): IUserBuilder {
        this.user.joinDefaultChannels = join;
        return this;
    }

    public getJoinDefaultChannels(): boolean {
        return this.user.joinDefaultChannels;
    }

    public setVerified(verified: boolean): IUserBuilder {
        this.user.verified = verified;
        return this;
    }

    public getVerified(): boolean {
        return this.user.verified;
    }

    public setRequirePasswordchange(changePassword: boolean): IUserBuilder {
        this.user.requirePasswordChange = changePassword;
        return this;
    }

    public getRequirePasswordchange(): boolean {
        return this.user.requirePasswordChange;
    }

    public setSendWelcomeEmail(sendEmail: boolean): IUserBuilder {
        this.user.sendWelcomeEmail = sendEmail;
        return this;
    }

    public getSendWelcomeEmail(): boolean {
        return this.user.sendWelcomeEmail;
    }

    public getUser(): IUserGenerate {
        if (!this.user.username) {
            throw new Error('The "username" property is required.');
        }
        if (!this.user.email) {
            throw new Error('The "email" property is required.');
        }
        if (!this.user.name) {
            throw new Error('The "name" property is required.');
        }
        if (!this.user.roles) {
            throw new Error('The "roles" property is required.');
        }

        return this.user;
    }
}
