export class Event {
    id?: string | number;
    start: Date;
    end ?: Date;
    title: string;
    allDay?: boolean;
    color?: object;
    colorName ?: string;
    userId ?: string;
    status ?: string;
    createdBy ?: string;

    constructor() {
        this.start = new Date();
        this.end = new Date();
        this.title = '';
        this.allDay = false;
        this.colorName = '';
    }
}
