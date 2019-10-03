import { IExternalComponent } from '../../definition/externalComponent';

export class ExternalComponentAlreadyTouchedError implements Error {
    public name: string = 'ExternalComponentAlreadyTouched';
    public message: string;

    constructor(externalComponent: IExternalComponent) {
        this.message = `The app (${externalComponent.appId}) has already touched the external component (${externalComponent.name})`;
    }
}
