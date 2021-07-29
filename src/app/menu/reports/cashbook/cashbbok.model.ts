export class CashBook {
  constructor(
    public id: string,
    public entryDate: Date,
    public entryAmount: number,
    public entryDesc: string,
    public payeeName: string
  ) {}
}
