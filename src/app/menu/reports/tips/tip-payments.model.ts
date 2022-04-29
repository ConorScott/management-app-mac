export class TipPayments {
  constructor(
    public id: string,
    public entryDate: Date,
    public entryAmount: number,
    public entryDesc: string,
    public payeeName: string,
    public paymentDate: Date,
    public payeeId: string
  ) {}
}
