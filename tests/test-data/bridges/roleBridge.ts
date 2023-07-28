import { IRole } from '../../../src/definition/roles';
import { RoleBridge } from '../../../src/server/bridges';

export class TestsRoleBridge extends RoleBridge {
    public getOneByIdOrName(idOrName: IRole['_id'] | IRole['name'], appId: string): Promise<IRole | null> {
        throw new Error('Method not implemented.');
    }
}
