/**
 * Represents the parameters of a webhook example.
 */
export interface IWebhookExample {
    params?: {[key: string]: string};
    query?: {[key: string]: string};
    headers?: {[key: string]: string};
    content?: any;
}

/**
 * Decorator to describe webhook examples
 */
export function example(options: IWebhookExample) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        target.examples = target.examples || {};
        target.examples[propertyKey] = options;
    };
}
