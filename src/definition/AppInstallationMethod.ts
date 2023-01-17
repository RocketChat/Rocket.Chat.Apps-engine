export declare enum AppInstallationMethod {
    /** PUBLIC types of instalation. */
    PUBLIC_MARKETPLACE = "public/marketplace",
    /** PRIVATE types of instalation. */
    PRIVATE_URL = "private/url",
    PRIVATE_FILE = "private/file",
}
export declare class AppInstallationMethodUtilsDef {
    isPublic(status: AppInstallationMethod): boolean;
    isPrivate(status: AppInstallationMethod): boolean;
}
export declare const AppInstallationMethodUtils: AppInstallationMethodUtilsDef;
