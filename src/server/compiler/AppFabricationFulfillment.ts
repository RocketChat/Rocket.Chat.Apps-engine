import { IAppInfo } from '../../definition/metadata';

import { ProxiedApp } from '../ProxiedApp';
import { ICompilerError } from './ICompilerError';

export class AppFabricationFulfillment {
    public info: IAppInfo;
    public app: ProxiedApp;
    public implemented: { [int: string]: boolean };
    public compilerErrors: Array<ICompilerError>;

    public licenseError: Error | null;

    constructor() {
        this.compilerErrors = new Array<ICompilerError>();
        this.licenseError = null;
    }

    public setAppInfo(information: IAppInfo): void {
        this.info = information;
    }

    public getAppInfo(): IAppInfo {
        return this.info;
    }

    public setApp(application: ProxiedApp): void {
        this.app = application;
    }

    public getApp(): ProxiedApp {
        return this.app;
    }

    public setImplementedInterfaces(interfaces: { [int: string]: boolean }): void {
        this.implemented = interfaces;
    }

    public getImplementedInferfaces(): { [int: string]: boolean } {
        return this.implemented;
    }

    public setCompilerErrors(errors: Array<ICompilerError>): void {
        this.compilerErrors = errors;
    }

    public getCompilerErrors(): Array<ICompilerError> {
        return this.compilerErrors;
    }

    public setLicenseError(error: Error) {
        this.licenseError = error;
    }

    public getLicenseError(): Error {
        return this.licenseError;
    }
}
