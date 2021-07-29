
export class Payment {
  constructor(
    public id: string,
    public paymentId: string,
    public paymentDate: Date,
    public amount: number,
    public paymentMethod: string,
    public payeeName: string,
    public deceasedName: string
  ) {}
}
