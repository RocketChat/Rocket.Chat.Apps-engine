import { IExternalComponent } from '../../../src/definition/externalComponent';
import { IExternalComponentBridge } from '../../../src/server/bridges';
export class TestExternalComponentBridge implements IExternalComponentBridge {
    // TODO Need to add the actual tests here
    public registerExternalComponent(externalComponent: IExternalComponent, appId: string): void {
        return;
    }
}
