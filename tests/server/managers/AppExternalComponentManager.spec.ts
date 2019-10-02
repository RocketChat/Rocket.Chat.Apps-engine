import { Expect, SetupFixture, Test } from 'alsatian';
import { ExternalComponentLocation, IExternalComponent } from '../../../src/definition/externalComponent/IExternalComponent';
import { ExternalComponentAlreadyTouchedError, ExternalComponentNotMatchWithAppError } from '../../../src/server/errors';
import { AppExternalComponentManager } from '../../../src/server/managers';

export class AppExternalComponentManagerTestFixture {
    private mockExternalComponent1: IExternalComponent;
    private mockExternalComponent2: IExternalComponent;
    private mockExternalComponent3: IExternalComponent;
    private mockAppExternalComponentManager: AppExternalComponentManager;

    @SetupFixture
    public setupFixture() {
        this.mockExternalComponent1 = {
            appId: '1eb382c0-3679-44a6-8af0-18802e342fb1',
            name: 'TestExternalComponent1',
            description: 'TestExternalComponent1',
            url: '',
            icon: '',
            location: ExternalComponentLocation.CONTEXTUAL_BAR,
        } as IExternalComponent;
        this.mockExternalComponent2 = {
            appId: '125a944b-9747-4e6e-b029-6e9b26bb3481',
            name: 'TestExternalComponent2',
            description: 'TestExternalComponent2',
            url: '',
            icon: '',
            location: ExternalComponentLocation.CONTEXTUAL_BAR,
        } as IExternalComponent;
        this.mockExternalComponent3 = {
            ...this.mockExternalComponent2,
            appId: this.mockExternalComponent1.appId,
            name: this.mockExternalComponent2.name,
        } as IExternalComponent;
        this.mockAppExternalComponentManager = new AppExternalComponentManager();
        this.mockAppExternalComponentManager.addExternalComponent(
            this.mockExternalComponent1.appId, this.mockExternalComponent1,
        );
    }

    @Test()
    public basicAppExternalComponentManager() {
        const aecm = new AppExternalComponentManager();

        Expect((aecm as any).providedExternalComponents.size).toBe(0);
        Expect((aecm as any).appTouchedExternalComponents.size).toBe(0);
    }

    @Test()
    public verifyGetProvidedExternalComponents() {
        const aecm = new AppExternalComponentManager();
        const component = this.mockExternalComponent1;

        Expect(aecm.getProvidedExternalComponents().size).toBe(0);

        aecm.registerExternalComponents(component.appId, new Map([
            [component.name, component],
        ]));
        Expect(aecm.getProvidedExternalComponents().size).toBe(1);
    }

    @Test()
    public verifyGetAppTouchedExternalComponents() {
        const aecm = new AppExternalComponentManager();
        const component = this.mockExternalComponent1;

        Expect(aecm.getAppTouchedExternalComponents().size).toBe(0);

        aecm.addExternalComponent(component.appId, component);
        Expect(aecm.getAppTouchedExternalComponents().size).toBe(1);
    }

    @Test()
    public verifyGetExternalComponents() {
        const aecm = new AppExternalComponentManager();
        const component = this.mockExternalComponent1;

        Expect(aecm.getExternalComponents(component.appId)).toBe(null);
        aecm.registerExternalComponents(component.appId, new Map([
            [component.name, component],
        ]));
        Expect(aecm.getExternalComponents(component.appId).size).toBe(1);
    }

    @Test()
    public verifyAddExternalComponent() {
        const aecm1 = new AppExternalComponentManager();
        const aecm2 = this.mockAppExternalComponentManager;
        const component1 = this.mockExternalComponent1;
        const component3 = this.mockExternalComponent3;

        Expect(() => aecm1.addExternalComponent('', this.mockExternalComponent1)).toThrowError(
            ExternalComponentNotMatchWithAppError,
            'The external component\'s appId does not match with the current app.',
        );

        Expect(() => aecm2.addExternalComponent(
            component1.appId, component1,
        )).toThrowError(
            ExternalComponentAlreadyTouchedError,
            `The app(${component1.appId}) has already touched the external component(${component1.name})`,
        );

        aecm1.addExternalComponent(component1.appId, component1);
        Expect(aecm1.getAppTouchedExternalComponents().size).toBe(1);
        Expect(aecm1.getExternalComponents(component1.appId).size).toBe(1);

        aecm1.addExternalComponent(component1.appId, component3);
        Expect(aecm1.getExternalComponents(component1.appId).size).toBe(2);
    }

    @Test()
    public verifyRegisterExternalComponents() {
        const aecm = new AppExternalComponentManager();
        const component1 = this.mockExternalComponent1;
        const component3 = this.mockExternalComponent3;

        Expect(() => aecm.registerExternalComponents('', new Map([
            [component1.name, component1],
        ]))).toThrowError(
            ExternalComponentNotMatchWithAppError,
            'The external component\'s appId does not match with the current app.',
        );

        aecm.registerExternalComponents(component1.appId, new Map([
            [component1.name, component1],
            [component3.name, component3],
        ]));
        Expect(aecm.getProvidedExternalComponents().size).toBe(1);
        Expect(aecm.getExternalComponents(component1.appId).size).toBe(2);
    }

    @Test()
    public verifyUnregisterExternalComponents() {
        const aecm = new AppExternalComponentManager();
        const component = this.mockExternalComponent1;

        aecm.registerExternalComponents(component.appId, new Map([
            [component.name, component],
        ]));
        Expect(aecm.getAppTouchedExternalComponents().size).toBe(1);
        Expect(aecm.getProvidedExternalComponents().size).toBe(1);

        aecm.unregisterExternalComponents(component.appId);
        Expect(aecm.getAppTouchedExternalComponents().size).toBe(1);
        Expect(aecm.getProvidedExternalComponents().size).toBe(0);
    }

    @Test()
    public verifyPurgeExternalComponents() {
        const aecm = new AppExternalComponentManager();
        const component = this.mockExternalComponent1;

        aecm.registerExternalComponents(component.appId, new Map([
            [component.name, component],
        ]));
        Expect(aecm.getAppTouchedExternalComponents().size).toBe(1);
        Expect(aecm.getProvidedExternalComponents().size).toBe(1);

        aecm.purgeExternalComponents(component.appId);
        Expect(aecm.getAppTouchedExternalComponents().size).toBe(0);
        Expect(aecm.getProvidedExternalComponents().size).toBe(0);
    }
}
