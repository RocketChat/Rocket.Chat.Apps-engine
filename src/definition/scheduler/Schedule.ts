import { parseExpression } from 'cron-parser';

export class Schedule {
    /** This is the original cron schedule passed in. */
    public readonly originalCron: string;
    private readonly details: ICronExpression;

    constructor(cron: string) {
        this.originalCron = cron;
        this.details = parseExpression(cron, { utc: true }); // make all dates utc based instead of timezone based
    }

    public hasNext(): boolean {
        return this.details.hasNext();
    }

    public getNext(): Date | undefined {
        if (this.details.hasNext()) {
            const cd = this.details.next() as ICronDate;

            return cd.toDate();
        }

        return undefined;
    }
}

interface ICronExpression {
    hasNext(): boolean;
    next(): any;
}

interface ICronDate {
    toDate(): Date;
}
