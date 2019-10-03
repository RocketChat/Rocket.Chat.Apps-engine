import { IExternalComponentOptions } from './IExternalComponentOptions';
/**
 * Represents an external component that is being provided.
 */
export interface IExternalComponent {
    /**
     * Provides the appId of the app which the external component belongs to.
     */
    appId: string;
    /**
     * Provides the name of the external component. This key must be unique.
     */
    name: string;
    /**
     * Provides the description of the external component.
     */
    description: string;
    /**
     * Provides the icon's url or base64 string.
     */
    icon: string;
    /**
     * Provides the location which external component needs
     * to register, see the ExternalComponentLocation descriptions
     * for the more information.
     */
    location: ExternalComponentLocation;
    /**
     * Provides the url that external component will load.
     */
    url: string;
    /**
     * Provides options for the external component.
     */
    options?: IExternalComponentOptions;
}

export enum ExternalComponentLocation {
    CONTEXTUAL_BAR = 'CONTEXTUAL_BAR',

    MODAL = 'MODAL',
}
