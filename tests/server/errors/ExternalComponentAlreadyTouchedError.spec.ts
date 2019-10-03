import { Expect, SetupFixture, Test } from 'alsatian';
import { ExternalComponentLocation, IExternalComponent } from '../../../src/definition/externalComponent/IExternalComponent';
import { ExternalComponentAlreadyTouchedError } from '../../../src/server/errors';

export class ExternalComponentAlreadyTouchedErrorTestFixture {
    private mockExternalComponent: IExternalComponent;

    @SetupFixture
    public setupFixture() {
        this.mockExternalComponent = {
            appId: '1eb382c0-3679-44a6-8af0-18802e342fb1',
            name: 'TestExternalComponent',
            description: '',
            url: '',
            icon: '',
            location: ExternalComponentLocation.CONTEXTUAL_BAR,
        } as IExternalComponent;
    }

    @Test()
    public verifyAppAlreadyRegisteredExternalComponentError() {
        const err = new ExternalComponentAlreadyTouchedError(this.mockExternalComponent);

        Expect(err.name).toBe('ExternalComponentAlreadyTouched');
        Expect(err.message).toBe('The app (1eb382c0-3679-44a6-8af0-18802e342fb1) has already touched the external component (TestExternalComponent)');
    }
}
