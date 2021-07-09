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
  ){
    if(this.servicesPrice == null){
      this.servicesPrice = 0;
    }
    if(this.coffinPrice == null){
      this.coffinPrice = 0;
    }
    if(this.casketCoverPrice == null){
      this.casketCoverPrice = 0;
    }
    if(this.coronerDoctorCertPrice == null){
      this.coronerDoctorCertPrice = 0;
    }
    if( this.cremationPrice  == null){
      this.cremationPrice = 0;
    }
    if( this.urnPrice  == null){
      this.urnPrice = 0;
    }
    if( this.churchOfferringPrice  == null){
      this.churchOfferringPrice = 0;
    }
    if( this.sacristianPrice  == null){
      this.sacristianPrice = 0;
    }
    if( this.flowersPrice  == null){
      this.flowersPrice = 0;
    }
    if( this.graveOpenPrice  == null){
      this.graveOpenPrice  = 0;
    }
    if( this.gravePurchasePrice == null){
      this.gravePurchasePrice  = 0;
    }
    if( this.graveMarkerPrice == null){
      this.graveMarkerPrice  = 0;
    }
    if( this.graveMatsTimbersPrice == null){
      this.graveMatsTimbersPrice = 0;
    }
    if( this.clothsPrice == null){
      this.clothsPrice = 0;
    }
    if( this.hairdresserPrice == null){
      this.hairdresserPrice = 0;
    }
    if( this.radioNoticePrice == null){
      this.radioNoticePrice = 0;
    }
    if( this.paperNoticePrice == null){
      this.paperNoticePrice = 0;
    }
    if( this.organistPrice == null){
      this.organistPrice = 0;
    }
    if(this.soloistPrice == null){
      this.soloistPrice = 0;
    }
    if(this.otherDetailsPrice == null){
      this.otherDetailsPrice = 0;
    }
  }
  get totalBalance(){
    return this.servicesPrice
   + this.coffinPrice
    + this.casketCoverPrice
    + this.coronerDoctorCertPrice
    + this.cremationPrice
    + this.urnPrice
    + this.churchOfferringPrice
    + this.sacristianPrice
    + this.flowersPrice
    + this.graveOpenPrice
    + this.gravePurchasePrice
    + this.graveMarkerPrice
    + this.graveMatsTimbersPrice
    + this.clothsPrice
    + this.hairdresserPrice
    + this.radioNoticePrice
    + this.paperNoticePrice
    + this.organistPrice
    + this.soloistPrice
    + this.otherDetailsPrice;
  }

}
