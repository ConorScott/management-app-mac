export class PaymentType {
  constructor(
    public cash: boolean,
    public card: boolean,
    public draft: boolean,
    public eft: boolean,
  ) {}
}
