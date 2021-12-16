import { IEmailDescriptor } from './IEmailDescriptor';

export interface IPreEmailSentContext {
    context: unknown;
    email: IEmailDescriptor;
}
