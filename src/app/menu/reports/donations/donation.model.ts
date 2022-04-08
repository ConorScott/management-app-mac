export class Donation {
  constructor(
    public id: string,
    public donationDate: Date,
    public donationType: string,
    public donationDesc: string,
    public payeeName: string,
    public amount?: number
  ) {}
}
