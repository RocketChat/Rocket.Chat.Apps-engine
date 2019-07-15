
export class AppLicenseValidationResult {
    private errors: Map<string, string>;
    private warnings: Map<string, string>;
    private validated: boolean;
    private appId: string;

    constructor() {
        this.validated = false;
        this.errors = new Map<string, string>();
        this.warnings = new Map<string, string>();
    }

    public addError(field: string, message: string): void {
        this.errors.set(field, message);
    }

    public addWarning(field: string, message: string): void {
        this.warnings.set(field, message);
    }

    public get hasErrors(): boolean {
        return !!this.errors.size;
    }

    public get hasWarnings(): boolean {
        return !!this.warnings.size;
    }

    public get hasBeenValidated(): boolean {
        return this.validated;
    }

    public setValidated(validated: boolean): void {
        this.validated = validated;
    }

    public setAppId(appId: string): void {
        this.appId = appId;
    }

    public getAppId(): string {
        return this.appId;
    }

    public getErrors(): Map<string, string> {
        return this.errors;
    }

    public getWarnings(): Map<string, string> {
        return this.warnings;
    }
}
