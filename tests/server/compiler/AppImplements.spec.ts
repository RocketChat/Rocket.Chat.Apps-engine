import { AppImplements, AppInterface } from '../../../src/server/compiler';

test('appImplements', () => {
    expect(() => new AppImplements()).not.toThrow();

    const impls = new AppImplements();

    expect(impls.getValues()).toBeDefined();
    expect(() => impls.doesImplement(AppInterface.IPreMessageSentPrevent)).not.toThrow();
    expect(impls.getValues()[AppInterface.IPreMessageSentPrevent]).toBe(true);
    expect(() => impls.doesImplement('Something')).not.toThrow();
    expect(impls.getValues().Something).not.toBeDefined();
});
