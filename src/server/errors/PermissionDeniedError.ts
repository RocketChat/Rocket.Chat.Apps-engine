import { IPermission } from '../../definition/permission/IPermission';

interface IPermissionDeniedErrorParams {
    appId: string;
    missingPermissions: Array<IPermission>;
    reason?: string;
}

export class PermissionDeniedError implements Error {
    public name: string = 'Permission_Denied_Error';
    public message: string;

    constructor({ appId, missingPermissions, reason }: IPermissionDeniedErrorParams) {
        const permissions = missingPermissions
            .map((permission) => `"${ JSON.stringify(permission) }"`)
            .join(', ');
        this.message = `Failed to call the method as the app (${ appId }) lacks the following permissions:\n`
            + `[${ permissions }]. Declare them in your app.json to fix the issue.\n`
            + `reason: ${ reason }`;
    }
}
