import { IAppInfo } from '../../definition/metadata';
import { AppLicenseValidationResult } from '../marketplace/license';
import { ProxiedApp } from '../ProxiedApp';
import { ICompilerError } from './ICompilerError';

export class AppFabricationFulfillment {
    public info: IAppInfo;
    public app: ProxiedApp;
    public implemented: { [int: string]: boolean };
    public compilerErrors: Array<ICompilerError>;
    public licenseValidationResult: AppLicenseValidationResult;
    public storageError: string;
    public appUserError: object;

    constructor() {
        this.compilerErrors = new Array<ICompilerError>();
        this.licenseValidationResult = new AppLicenseValidationResult();
    }

    public setAppInfo(information: IAppInfo): void {
        this.info = information;
        this.licenseValidationResult.setAppId(information.id);
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

    public setStorageError(errorMessage: string): void {
        this.storageError = errorMessage;
    }

    public setAppUserError(error: object): void {
        this.appUserError = error;
    }

    public getStorageError(): string {
        return this.storageError;
    }

    public getAppUserError(): object {
        return this.appUserError;
    }

    public hasStorageError(): boolean {
        return !!this.storageError;
    }

    public hasAppUserError(): boolean {
        return !!this.appUserError;
    }

    public getLicenseValidationResult(): AppLicenseValidationResult {
        return this.licenseValidationResult;
    }
}
