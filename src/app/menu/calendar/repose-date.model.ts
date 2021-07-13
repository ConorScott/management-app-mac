export class ReposeEvent {
  constructor(
    public id: string,
    public title: string,
    public start: Date,
    public end: Date,
    public color,
    public allDay: boolean,
  ){}
}
