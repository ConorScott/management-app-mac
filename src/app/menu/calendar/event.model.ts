export class Event {
  constructor(
    public id: string,
    public deceasedId: string,
    public title: string,
    public start: Date,
    public end: Date,
    public color,
    public allDay: boolean,
    public desc?: string
  ){}
}
