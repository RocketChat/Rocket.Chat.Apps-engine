import { IVisitorEmail } from './IVisitorEmail';
import { IVisitorPhone } from './IVisitorPhone';

export interface IVisitor {
    id?: string;
    token: string;
    username: string;
    updatedAt: Date;
    name: string;
    department?: string;
    phone?: Array<IVisitorPhone>;
    visitorEmails: Array<IVisitorEmail>;
    customFields?: { [key: string]: any };
}
