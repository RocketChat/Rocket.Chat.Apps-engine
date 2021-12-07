import { App } from '../App';

export enum EventPriority {
    LOWEST = 0,
    LOW = 25,
    NORMAL = 50,
    HIGH = 75,
    HIGHEST = 100,
}

export interface IEventPriorityFunction {
    priority: EventPriority;
    (...p: Array<any>): Promise<any>;
}

export const SetEventPriority = (priority: EventPriority) => (target: App, propertyKey: string, descriptor: TypedPropertyDescriptor<(...p: Array<any>) => Promise<any>>) => {
    console.log(target.getName(), 'is setting the priority of', propertyKey, 'to a value of', priority);

    ((target as any)[propertyKey] as IEventPriorityFunction).priority = priority;

    return descriptor;
};
