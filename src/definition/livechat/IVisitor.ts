import { IVisitorEmail } from './IVisitorEmail';
import { IVisitorPhone } from './IVisitorPhone';

export interface IVisitor {
    id: string;
    department: string;
    username: string;
    updatedAt: Date;
    name: string;
    token: string;
    phone: Array<IVisitorPhone>;
    visitorEmails: Array<IVisitorEmail>;
}
