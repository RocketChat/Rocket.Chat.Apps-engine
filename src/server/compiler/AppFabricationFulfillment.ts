import { ProxiedApp } from '../ProxiedApp';
import { ICompilerError } from './ICompilerError';

export class AppFabricationFulfillment {
    public app: ProxiedApp;
    public implemented: { [int: string]: boolean };
    public compilerErrors: Array<ICompilerError>;

    constructor() {
        this.compilerErrors = new Array<ICompilerError>();
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
}
