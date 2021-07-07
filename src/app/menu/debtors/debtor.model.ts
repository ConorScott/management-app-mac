
export class Debtor {

  constructor(
    public id: string,
    public deceasedName: string,
    public responsible: string,
    public invoiceDate: Date,
    public servicesPrice: number,
    public coffinDetails: string,
    public coffinPrice: number,
    public casketCoverPrice: number,
    public coronerDoctorCertPrice: number,
    public cremationPrice: number,
    public urnPrice: number,
    public churchOfferringPrice: number,
    public sacristianPrice: number,
    public flowersPrice: number,
    public graveOpenPrice: number,
    public gravePurchasePrice: number,
    public graveMarkerPrice: number,
    public graveMatsTimbersPrice: number,
    public clothsPrice: number,
    public hairdresserPrice: number,
    public radioNoticePrice: number,
    public paperNoticePrice: number,
    public organistPrice: number,
    public soloistPrice: number,
    public otherDetailsPrice: number,
    public totalBalance: number
  ){

  }

}
