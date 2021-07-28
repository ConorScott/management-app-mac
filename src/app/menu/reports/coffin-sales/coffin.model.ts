export class CoffinSale {
  constructor(
    public id: string,
    public coffinSaleDate: Date,
    public coffinName: string,
    public stockLocation: string,
    public amount: number,
    public deceasedName: string
  ) {}
}
