/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Payment } from 'src/app/shared/payment.model';
import { PaymentService } from '../reports/payments/payment.service';
import { Debtor } from './debtor.model';

interface DebtorData {
  deceasedName: string;
  responsible: string;
  invoiceDate: Date;
  servicesPrice: number;
  coffinDetails: string;
  coffinPrice: number;
  casketCoverPrice: number;
  coronerDoctorCertPrice: number;
  cremationPrice: number;
  urnPrice: number;
  churchOfferringPrice: number;
  sacristianPrice: number;
  flowersPrice: number;
  graveOpenPrice: number;
  gravePurchasePrice: number;
  graveMarkerPrice: number;
  graveMatsTimbersPrice: number;
  clothsPrice: number;
  hairdresserPrice: number;
  radioNoticePrice: number;
  paperNoticePrice: number;
  organistPrice: number;
  soloistPrice: number;
  otherDetailsPrice: number;
  totalBalance: number;
  payments: Payment;
}

@Injectable({
  providedIn: 'root',
})
export class DebtorService {
  private _debtor = new BehaviorSubject<Debtor[]>([]);

  get debtor() {
    return this._debtor.asObservable();
  }


  constructor(private http: HttpClient, private authService: AuthService, private paymentService: PaymentService) {}

  addDebtor(
    invoiceId: string,
    deceasedName: string,
    responsible: string,
    invoiceDate: Date,
    servicesPrice: number,
    coffinDetails: string,
    coffinPrice: number,
    casketCoverPrice: number,
    coronerDoctorCertPrice: number,
    cremationPrice: number,
    urnPrice: number,
    churchOfferringPrice: number,
    sacristianPrice: number,
    flowersPrice: number,
    graveOpenPrice: number,
    gravePurchasePrice: number,
    graveMarkerPrice: number,
    graveMatsTimbersPrice: number,
    clothsPrice: number,
    hairdresserPrice: number,
    radioNoticePrice: number,
    paperNoticePrice: number,
    organistPrice: number,
    soloistPrice: number,
    otherDetailsPrice: number,
    totalBalance: number
  ) {
    let generatedId: string;
    let fetchedUserId: string;
    let newDebtor: Debtor;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
       switchMap(token => {
      if (!fetchedUserId) {
        throw new Error('No user found!');
      }
      newDebtor = new Debtor(
        invoiceId,
        deceasedName,
        responsible,
        invoiceDate,
        servicesPrice,
        coffinDetails,
        coffinPrice,
        casketCoverPrice,
        coronerDoctorCertPrice,
        cremationPrice,
        urnPrice,
        churchOfferringPrice,
        sacristianPrice,
        flowersPrice,
        graveOpenPrice,
        gravePurchasePrice,
        graveMarkerPrice,
        graveMatsTimbersPrice,
        clothsPrice,
        hairdresserPrice,
        radioNoticePrice,
        paperNoticePrice,
        organistPrice,
        soloistPrice,
        otherDetailsPrice,
      );
      return this.http
        .put<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/debtors/${invoiceId}.json?auth=${token}`,
          { ...newDebtor, id: null }
        );
    }),
        switchMap(resData => {
          generatedId = resData.name;
          return this.debtor;
        }),
        take(1),
        tap(debtors => {
          newDebtor.id = generatedId;
          this._debtor.next(debtors.concat(newDebtor));
        })
      );
  }

  fetchDebtors() {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<{ [key: string]: DebtorData }>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/debtors.json?auth=${token}`
      );
    }),map((resData) => {
      const invoice = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          invoice.push(
            new Debtor(
              key,
              resData[key].deceasedName,
              resData[key].responsible,
              resData[key].invoiceDate,
              resData[key].servicesPrice,
              resData[key].coffinDetails,
              resData[key].coffinPrice,
              resData[key].casketCoverPrice,
              resData[key].coronerDoctorCertPrice,
              resData[key].cremationPrice,
              resData[key].urnPrice,
              resData[key].churchOfferringPrice,
              resData[key].sacristianPrice,
              resData[key].flowersPrice,
              resData[key].graveOpenPrice,
              resData[key].gravePurchasePrice,
              resData[key].graveMarkerPrice,
              resData[key].graveMatsTimbersPrice,
              resData[key].clothsPrice,
              resData[key].hairdresserPrice,
              resData[key].radioNoticePrice,
              resData[key].paperNoticePrice,
              resData[key].organistPrice,
              resData[key].soloistPrice,
              resData[key].otherDetailsPrice,
            )
          );
        }
      }
      return invoice.reverse();
    }),
    tap((debtor) => {
      this._debtor.next(debtor);
    })
    );
  }

  getDebtor(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<DebtorData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/debtors/${id}.json?auth=${token}`
        );
      }),
      map((resData) => {
        return new Debtor(
          id,
          resData.deceasedName,
          resData.responsible,
          resData.invoiceDate,
          resData.servicesPrice,
          resData.coffinDetails,
          resData.coffinPrice,
          resData.casketCoverPrice,
          resData.coronerDoctorCertPrice,
          resData.cremationPrice,
          resData.urnPrice,
          resData.churchOfferringPrice,
          resData.sacristianPrice,
          resData.flowersPrice,
          resData.graveOpenPrice,
          resData.gravePurchasePrice,
          resData.graveMarkerPrice,
          resData.graveMatsTimbersPrice,
          resData.clothsPrice,
          resData.hairdresserPrice,
          resData.radioNoticePrice,
          resData.paperNoticePrice,
          resData.organistPrice,
          resData.soloistPrice,
          resData.otherDetailsPrice,
        );
      })
    );
  }

  updateDebtor(debtorId: string, totalBalance: number, payments: Payment) {
    let updateDebtor: Debtor[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.debtor;
      }),
      take(1),
      switchMap((debtors) => {
        if (!debtors || debtors.length <= 0) {
          return this.fetchDebtors();
        } else {
          return of(debtors);
        }
      }),
      switchMap((debtors) => {
        const updateDebtorIndex = debtors.findIndex((pl) => pl.id === debtorId);
        updateDebtor = [...debtors];
        const oldDebtor = updateDebtor[updateDebtorIndex];

        console.log(totalBalance);
        updateDebtor[updateDebtorIndex] = new Debtor(
          oldDebtor.id,
          oldDebtor.deceasedName,
          oldDebtor.responsible,
          oldDebtor.invoiceDate,
          oldDebtor.servicesPrice,
          oldDebtor.coffinDetails,
          oldDebtor.coffinPrice,
          oldDebtor.casketCoverPrice,
          oldDebtor.coronerDoctorCertPrice,
          oldDebtor.cremationPrice,
          oldDebtor.urnPrice,
          oldDebtor.churchOfferringPrice,
          oldDebtor.sacristianPrice,
          oldDebtor.flowersPrice,
          oldDebtor.graveOpenPrice,
          oldDebtor.gravePurchasePrice,
          oldDebtor.graveMarkerPrice,
          oldDebtor.graveMatsTimbersPrice,
          oldDebtor.clothsPrice,
          oldDebtor.hairdresserPrice,
          oldDebtor.radioNoticePrice,
          oldDebtor.paperNoticePrice,
          oldDebtor.organistPrice,
          oldDebtor.soloistPrice,
          oldDebtor.otherDetailsPrice,
        );
        this.paymentService.addPayment(payments, debtorId, fetchedToken);
        return this.http.put<Debtor>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/debtors/${debtorId}.json?auth=${fetchedToken}`,
          { ...updateDebtor[updateDebtorIndex], id: null }
        );
      }),
      tap(() => {
        // eslint-disable-next-line no-underscore-dangle
        this._debtor.next(updateDebtor);
      })
    );
  }
  updateInvoiceDebtor(
    invoiceId: string,
    deceasedName: string,
    responsible: string,
    invoiceDate: Date,
    servicesPrice: number,
    coffinDetails: string,
    coffinPrice: number,
    casketCoverPrice: number,
    coronerDoctorCertPrice: number,
    cremationPrice: number,
    urnPrice: number,
    churchOfferringPrice: number,
    sacristianPrice: number,
    flowersPrice: number,
    graveOpenPrice: number,
    gravePurchasePrice: number,
    graveMarkerPrice: number,
    graveMatsTimbersPrice: number,
    clothsPrice: number,
    hairdresserPrice: number,
    radioNoticePrice: number,
    paperNoticePrice: number,
    organistPrice: number,
    soloistPrice: number,
    otherDetailsPrice: number,
    totalBalance: number
  ) {
    // const totalBalance =
    // servicesPrice +
    // coffinPrice +
    // casketCoverPrice +
    // coronerDoctorCertPrice +
    // cremationPrice +
    // urnPrice +
    // churchOfferringPrice +
    // sacristianPrice +
    // flowersPrice +
    // graveOpenPrice +
    // gravePurchasePrice +
    // graveMarkerPrice +
    // graveMatsTimbersPrice +
    // clothsPrice +
    // hairdresserPrice +
    // radioNoticePrice +
    // paperNoticePrice +
    // organistPrice +
    // soloistPrice +
    // otherDetailsPrice;
    let updateDebtor: Debtor[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.debtor;
      }),
      take(1),
      switchMap((debtors) => {
        if (!debtors || debtors.length <= 0) {
          return this.fetchDebtors();
        } else {
          return of(debtors);
        }
      }),
      switchMap((debtors) => {
        const updateDebtorIndex = debtors.findIndex(
          (pl) => pl.id === invoiceId
        );
        updateDebtor = [...debtors];
        const oldDebtor = updateDebtor[updateDebtorIndex];

        console.log(totalBalance);
        updateDebtor[updateDebtorIndex] = new Debtor(
          invoiceId,
          deceasedName,
          responsible,
          invoiceDate,
          servicesPrice,
          coffinDetails,
          coffinPrice,
          casketCoverPrice,
          coronerDoctorCertPrice,
          cremationPrice,
          urnPrice,
          churchOfferringPrice,
          sacristianPrice,
          flowersPrice,
          graveOpenPrice,
          gravePurchasePrice,
          graveMarkerPrice,
          graveMatsTimbersPrice,
          clothsPrice,
          hairdresserPrice,
          radioNoticePrice,
          paperNoticePrice,
          organistPrice,
          soloistPrice,
          otherDetailsPrice,
        );
        return this.http.put<Debtor>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/debtors/${invoiceId}.json?auth=${fetchedToken}`,
          { ...updateDebtor[updateDebtorIndex], id: null }
        );
      }),
      tap(() => {
        // eslint-disable-next-line no-underscore-dangle
        this._debtor.next(updateDebtor);
      })
    );
  }

  cancelBooking(debtorId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) =>
        this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/debtors/${debtorId}.json?auth=${token}`
        )
      ),
      // eslint-disable-next-line arrow-body-style
      switchMap(() => {
        return this.debtor;
      }),
      take(1),
      tap((debtor) => {
        // eslint-disable-next-line no-underscore-dangle
        this._debtor.next(debtor.filter((b) => b.id !== debtorId));
      })
    );
  }
}
