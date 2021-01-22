import { IPermission } from '../../definition/permissions/IPermission';

interface IPermissionDeniedErrorParams {
    appId: string;
    missingPermissions: Array<IPermission>;
    methodName?: string;
    reason?: string;
}

export class PermissionDeniedError extends Error {
    constructor({ appId, missingPermissions,  methodName, reason }: IPermissionDeniedErrorParams) {
        const permissions = missingPermissions
            .map((permission) => `"${ JSON.stringify(permission) }"`)
            .join(', ');

        super(`Failed to call the method ${ methodName  ? `"${ methodName }"` : '' } as the app (${ appId }) lacks the following permissions:\n`
        + `[${ permissions }]. Declare them in your app.json to fix the issue.\n`
        + `reason: ${ reason }`);
    }
}
