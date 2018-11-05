import { Recurrence, ScheduleData } from 'later';
import { parse } from 'later';

function isScheduleData(arg: any): arg is ScheduleData {
    return arg.schedules !== undefined;
}

export class Schedule implements ScheduleData {
    public static fromText(text: string): Schedule {
        const result = parse.text(text);

        return new Schedule(result);
    }

    public static fromCron(cron: string, withSeconds?: boolean) {
        const result = parse.cron(cron, withSeconds);

        return new Schedule(result);
    }

    public schedules: Array<Recurrence>;
    public exceptions: Array<Recurrence>;
    public error: number;

    constructor(schedules?: Array<Recurrence> | ScheduleData, exceptions?: Array<Recurrence>, error?: number) {
        if (Array.isArray(schedules) || typeof schedules === 'undefined') {
            this.schedules = schedules || [];
            this.exceptions = exceptions || [];
            this.error = error || -1;
        } else if (isScheduleData(schedules)) {
            this.schedules = schedules.schedules;
            this.exceptions = schedules.exceptions;
            this.error = schedules.error;
        }
    }
}
