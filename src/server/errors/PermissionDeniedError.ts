import { IPermission } from '../../definition/permission/IPermission';

export class PermissionDeniedError implements Error {
    public name: string = 'Permission_Denied_Error';
    public message: string;

    constructor(appId: string, missingPermissions: Array<IPermission>, details?: string) {
        const permissions =  missingPermissions
            .map((permission) => `"${ permission }"`)
            .join(', ');
        this.message = `Failed to call the method as the app (${ appId }) lacks the following permissions:\n`
            + `[${ permissions }]. Declare them in your app.json to fix the issue.\n`
            + `details: ${ details }`;
    }
}
