import { IThreadRead } from '../../definition/accessors/IThreadRead';
import { IMessage } from '../../definition/messages';
import { ThreadBridge } from '../bridges/ThreadBridge';

export class ThreadRead implements IThreadRead {
    constructor(private threadBridge: ThreadBridge, private appId: string) {}

    public getThreadById(id: string): Promise<Array<IMessage>> {
        return this.threadBridge.doGetById(id, this.appId);
    }
}
