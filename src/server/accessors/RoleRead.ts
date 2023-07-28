import { IRoleRead } from '../../definition/accessors/IRoleRead';
import { IRole } from '../../definition/roles';
import { RoleBridge } from '../bridges';

export class RoleRead implements IRoleRead {
    constructor(private roleBridge: RoleBridge, private appId: string) {}

    public getByIdOrName(idOrName: IRole['_id'] | IRole['name']): Promise<IRole | null> {
        return this.roleBridge.doGetOneByIdOrName(idOrName, this.appId);
    }
}
