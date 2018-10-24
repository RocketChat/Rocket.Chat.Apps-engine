export enum AppStatus {
    /** The status is known, aka not been constructed the proper way. */
    UNKNOWN = 'unknown',
    /** The App has been constructed but that's it. */
    CONSTRUCTED = 'constructed',
    /** The App's `initialize()` was called and returned true. */
    INITIALIZED = 'initialized',
    /** The App's `onEnable()` was called, returned true, and this was done automatically (system start up). */
    AUTO_ENABLED = 'auto_enabled',
    /** The App's `onEnable()` was called, returned true, and this was done by the user such as installing a new one. */
    MANUALLY_ENABLED = 'manually_enabled',
    /**
     * The App was disabled due to an error while attempting to compile it.
     * An attempt to enable it again will fail, as it needs to be updated.
     */
    COMPILER_ERROR_DISABLED = 'compiler_error_disabled',
    /** The App was disabled due to an unrecoverable error being thrown. */
    ERROR_DISABLED = 'error_disabled',
    /** The App was manually disabled by a user. */
    MANUALLY_DISABLED = 'manually_disabled',
    INVALID_SETTINGS_DISABLED = 'invalid_settings_disabled',
    /** The App was disabled due to other circumstances. */
    DISABLED = 'disabled',
}

export class AppStatusUtilsDef {
    public isEnabled(status: AppStatus): boolean {
        switch (status) {
            case AppStatus.AUTO_ENABLED:
            case AppStatus.MANUALLY_ENABLED:
                return true;
            default:
                return false;
        }
    }

    public isDisabled(status: AppStatus): boolean {
        switch (status) {
            case AppStatus.COMPILER_ERROR_DISABLED:
            case AppStatus.ERROR_DISABLED:
            case AppStatus.MANUALLY_DISABLED:
            case AppStatus.INVALID_SETTINGS_DISABLED:
            case AppStatus.DISABLED:
                return true;
            default:
                return false;
        }
    }
}

export const AppStatusUtils = new AppStatusUtilsDef();
