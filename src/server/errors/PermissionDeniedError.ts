import { AppPermission } from '../../definition/permission/AppPermission';

export class PermissionDeniedError implements Error {
    public name: string = 'Permission_Denied_Error';
    public message: string;

    constructor(appId: string, missingPermissions: Array<AppPermission>) {
        const permissions =  missingPermissions
            .map((permission) => `"${ permission }"`)
            .join(', ');
        this.message = `The app (${ appId }) failed to call the Api as it lacks the following permissions:\n`
            + `[${ permissions }]. Declare them in your app.json to fix the issue.`;
    }
}
