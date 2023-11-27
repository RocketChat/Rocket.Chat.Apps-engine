// deno-lint-ignore-file no-explicit-any
import { afterAll, beforeEach, describe, it } from 'https://deno.land/std@0.203.0/testing/bdd.ts';
import { assertSpyCall, spy } from 'https://deno.land/std@0.203.0/testing/mock.ts';

import { AppObjectRegistry } from '../../../AppObjectRegistry.ts';
import { ModifyCreator } from '../modify/ModifyCreator.ts';

describe('ModifyCreator', () => {
    const senderFn = (r: any) =>
        Promise.resolve({
            id: Math.random().toString(36).substring(2),
            jsonrpc: '2.0',
            result: r,
            serialize() {
                return JSON.stringify(this);
            },
        });

    beforeEach(() => {
        AppObjectRegistry.clear();
    });

    afterAll(() => {
        AppObjectRegistry.clear();
    });

    it('sends the correct payload in the request to create a message', async () => {
        const spying = spy(senderFn);
        const modifyCreator = new ModifyCreator(spying);
        const messageBuilder = modifyCreator.startMessage();

        // Importing types from the Apps-Engine is problematic, so we'll go with `any` here
        messageBuilder
            .setRoom({ id: '123' } as any)
            .setSender({ id: '456' } as any)
            .setText('Hello World')
            .setUsernameAlias('alias')
            .setAvatarUrl('https://avatars.com/123');

        // We can't get a legitimate result here, so we ignore it
        // but we need to know that the request sent was well formed
        await modifyCreator.finish(messageBuilder);

        assertSpyCall(spying, 0, {
            args: [
                {
                    method: 'bridges:getMessageBridge:doCreate',
                    params: [
                        {
                            room: { id: '123' },
                            sender: { id: '456' },
                            text: 'Hello World',
                            alias: 'alias',
                            avatarUrl: 'https://avatars.com/123',
                        },
                        // We don't know the app id in Denoland, the Apps-Engine needs to fill it in on that side
                        'APP_ID',
                    ],
                },
            ],
        });
    });
});
