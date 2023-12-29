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
    // deno-lint-ignore no-unused-vars
    const mockMethodWithoutParam = (read: any, modify: any, http: any, persis: any): Promise<string> => Promise.resolve('ok none');
    // deno-lint-ignore no-unused-vars
    const mockMethodWithOneParam = (call: any, read: any, modify: any, http: any, persis: any): Promise<string> => Promise.resolve('ok one');
    // deno-lint-ignore no-unused-vars
    const mockMethodWithTwoParam = (call: any, user: any, read: any, modify: any, http: any, persis: any): Promise<string> => Promise.resolve('ok two');
    // deno-lint-ignore no-unused-vars
    const mockMethodWithThreeParam = (call: any, user: any, options: any, read: any, modify: any, http: any, persis: any): Promise<string> => Promise.resolve('ok three');
    const mockProvider = {
        empty: mockMethodWithoutParam,
        one: mockMethodWithOneParam,
        two: mockMethodWithTwoParam,
        three: mockMethodWithThreeParam,
        error: () => { throw new Error() }
    }

    beforeEach(() => {
        AppObjectRegistry.clear();
        AppObjectRegistry.set('videoConfProvider:test-provider', mockProvider);
    });

    it('correctly handles execution of a videoconf method without additional params', async () => {
        const _spy = spy(mockProvider, 'empty');

        const result = await videoconfHandler('videoconference:test-provider:empty', []);

        assertEquals(result, 'ok none')
        assertEquals(_spy.calls[0].args.length, 4);
        
        _spy.restore();
    });

    it('correctly handles execution of a videoconf method with one param', async () => {
        const _spy = spy(mockProvider, 'one');

        const result = await videoconfHandler('videoconference:test-provider:one', ['call']);

        assertEquals(result, 'ok one')
        assertEquals(_spy.calls[0].args.length, 5);
        assertEquals(_spy.calls[0].args[0], 'call');

        _spy.restore();
    });

    it('correctly handles execution of a videoconf method with two params', async () => {
        const _spy = spy(mockProvider, 'two');

        const result = await videoconfHandler('videoconference:test-provider:two', ['call', 'user']);

        assertEquals(result, 'ok two')
        assertEquals(_spy.calls[0].args.length, 6);
        assertEquals(_spy.calls[0].args[0], 'call');
        assertEquals(_spy.calls[0].args[1], 'user');

        _spy.restore();
    });

    it('correctly handles execution of a videoconf method with three params', async () => {
        const _spy = spy(mockProvider, 'three');

        const result = await videoconfHandler('videoconference:test-provider:three', ['call', 'user', 'options']);

        assertEquals(result, 'ok three')
        assertEquals(_spy.calls[0].args.length, 7);
        assertEquals(_spy.calls[0].args[0], 'call');
        assertEquals(_spy.calls[0].args[1], 'user');
        assertEquals(_spy.calls[0].args[2], 'options');

        _spy.restore();
    });

    it('correctly handles an error on execution of a videoconf method', async () => {
        const result = await videoconfHandler('videoconference:test-provider:error', ['_']);

        assertInstanceOf(result, JsonRpcError)
    })
    
});
