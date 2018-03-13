export enum AppInterfaces {
    IPreMessageSentPrevent = 'IPreMessageSentPrevent',
    IPreMessageSentExtend = 'IPreMessageSentExtend',
    IPreMessageSentModify = 'IPreMessageSentModify',
    IPostMessageSent = 'IPostMessageSent',
}

export class AppImplements {
    private implemented: { [key: string]: boolean };

    constructor() {
        this.implemented = {};
        Object.keys(AppInterfaces).forEach((int) => this.implemented[int] = false);
    }

    public doesImplement(int: string): void {
        if (int in AppInterfaces) {
            this.implemented[int] = true;
        }
    }

    public getValues(): { [int: string]: boolean } {
        return Object.assign({}, this.implemented);
    }
}
