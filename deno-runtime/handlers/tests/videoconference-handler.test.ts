// deno-lint-ignore-file no-explicit-any
import { assertEquals } from 'https://deno.land/std@0.203.0/assert/mod.ts';
import { beforeEach, describe, it } from 'https://deno.land/std@0.203.0/testing/bdd.ts';
import { spy, stub } from "https://deno.land/std@0.203.0/testing/mock.ts";

import { AppObjectRegistry } from '../../AppObjectRegistry.ts';
import { AppAccessorsInstance } from '../../lib/accessors/mod.ts';
import videoconfHandler from '../videoconference-handler.ts';
import { assertInstanceOf } from "https://deno.land/std@0.203.0/assert/assert_instance_of.ts";
import { JsonRpcError } from "jsonrpc-lite";

describe('handlers > videoconference', () => {
    const mockMethodWithoutParam = (read: any, modify: any, http: any, persis: any): Promise<string> => Promise.resolve('ok none');
    const mockMethodWithOneParam = (user: any, read: any, modify: any, http: any, persis: any): Promise<string> => Promise.resolve('ok one');
    const mockMethodWithTwoParam = (user: any, options: any, read: any, modify: any, http: any, persis: any): Promise<string> => Promise.resolve('ok two');
    const mockProvider = {
        empty: mockMethodWithoutParam,
        one: mockMethodWithOneParam,
        two: mockMethodWithTwoParam,
        error: () => { throw new Error() }
    }

    beforeEach(() => {
        AppObjectRegistry.clear();
        AppObjectRegistry.set('videoConfProvider:test-provider', mockProvider);
    });

    it('correctly handles execution of a videoconf method without additional params', async () => {
        const _spy = spy(mockProvider, 'empty');
        stub(AppAccessorsInstance, 'getReader')

        const result = await videoconfHandler('videoconference:test-provider:empty', ['_']);

        assertEquals(result, 'ok none')
        assertEquals(_spy.calls[0].args.length, 4);
        
        _spy.restore();
    });

    it('correctly handles execution of a videoconf method with one param', async () => {
        const _spy = spy(mockProvider, 'one');

        const result = await videoconfHandler('videoconference:test-provider:one', ['_', 'user']);

        assertEquals(result, 'ok one')
        assertEquals(_spy.calls[0].args.length, 5);
        assertEquals(_spy.calls[0].args[0], 'user');

        _spy.restore();
    });

    it('correctly handles execution of a videoconf method with two params', async () => {
        const _spy = spy(mockProvider, 'one');

        const result = await videoconfHandler('videoconference:test-provider:one', ['_', 'user', 'options']);

        assertEquals(result, 'ok one')
        assertEquals(_spy.calls[0].args.length, 6);
        assertEquals(_spy.calls[0].args[0], 'user');
        assertEquals(_spy.calls[0].args[1], 'options');

        _spy.restore();
    });

    it('correctly handles an error on execution of a videoconf method', async () => {
        const result = await videoconfHandler('videoconference:test-provider:error', ['_']);

        assertInstanceOf(result, JsonRpcError)
    })
    
});
