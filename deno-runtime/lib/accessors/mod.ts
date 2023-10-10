
export function proxify(namespace: string) {
    return new Proxy({}, {
        get(target: unknown, prop: string): unknown {
            return (...args: unknown[]) => {
                return {};
            };
        }
    })
}

