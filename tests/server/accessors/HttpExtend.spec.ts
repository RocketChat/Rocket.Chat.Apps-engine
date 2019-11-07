import { IHttpPreRequestHandler, IHttpPreResponseHandler } from '../../../src/definition/accessors';

import { HttpExtend } from '../../../src/server/accessors';

test('basicHttpExtend', () => {
    expect(() => new HttpExtend()).not.toThrow();

    const he = new HttpExtend();
    expect(he.getDefaultHeaders()).toEqual(new Map());
    expect(he.getDefaultParams()).toEqual(new Map());
    expect(he.getPreRequestHandlers()).toBeEmpty();
    expect(he.getPreResponseHandlers()).toBeEmpty();
});

test('defaultHeadersInHttpExtend', () => {
    const he = new HttpExtend();

    expect(() => he.provideDefaultHeader('Auth', 'token')).not.toThrow();
    expect(he.getDefaultHeaders().size).toBe(1);
    expect(he.getDefaultHeaders().get('Auth')).toBe('token');

    expect(() => he.provideDefaultHeaders({
        Auth: 'token2',
        Another: 'thing',
    })).not.toThrow();
    expect(he.getDefaultHeaders().size).toBe(2);
    expect(he.getDefaultHeaders().get('Auth')).toBe('token2');
    expect(he.getDefaultHeaders().get('Another')).toBe('thing');
});

test('defaultParamsInHttpExtend', () => {
    const he = new HttpExtend();

    expect(() => he.provideDefaultParam('id', 'abcdefg')).not.toThrow();
    expect(he.getDefaultParams().size).toBe(1);
    expect(he.getDefaultParams().get('id')).toBe('abcdefg');

    expect(() => he.provideDefaultParams({
        id: 'zyxwvu',
        count: '4',
    })).not.toThrow();
    expect(he.getDefaultParams().size).toBe(2);
    expect(he.getDefaultParams().get('id')).toBe('zyxwvu');
    expect(he.getDefaultParams().get('count')).toBe('4');
});

test('preRequestHandlersInHttpExtend', () => {
    const he = new HttpExtend();

    const preRequestHandler: IHttpPreRequestHandler = {
        executePreHttpRequest: function _thing(url, req) {
            return new Promise((resolve) => resolve(req));
        },
    };

    expect(() => he.providePreRequestHandler(preRequestHandler)).not.toThrow();
    expect(he.getPreRequestHandlers()).not.toBeEmpty();
});

test('preResponseHandlersInHttpExtend', () => {
    const he = new HttpExtend();

    const preResponseHandler: IHttpPreResponseHandler = {
        executePreHttpResponse: function _thing(res) {
            return new Promise((resolve) => resolve(res));
        },
    };

    expect(() => he.providePreResponseHandler(preResponseHandler)).not.toThrow();
    expect(he.getPreResponseHandlers()).not.toBeEmpty();
});
