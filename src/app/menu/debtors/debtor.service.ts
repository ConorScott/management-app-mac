/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Payment } from 'src/app/shared/payment.model';
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

interface PaymentData {
  paymentDate: Date;
  amount: number;
  paymentMethod: string;
  payeeName: string;
}

@Injectable({
  providedIn: 'root',
})
export class DebtorService {
  private _debtor = new BehaviorSubject<Debtor[]>([]);
  private _payment = new BehaviorSubject<Payment[]>([]);

  get debtor() {
    return this._debtor.asObservable();
  }

  get payment() {
    return this._payment.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

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

  fetchPayments(id: string) {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<{ [key: string]: PaymentData }>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments/${id}.json?auth=${token}`
      );
    }), map((resData) => {
      const payments = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          payments.push(
            new Payment(
              key,
              resData[key].paymentDate,
              resData[key].amount,
              resData[key].paymentMethod,
              resData[key].payeeName
            )
          );
        }
      }
      return payments;
    }),
    tap((payment) => {
      this._payment.next(payment);
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

  getPayments(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<PaymentData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments/${id}.json?auth=${token}`
        );
      }),
      map((resData) => {
        return new Payment(
          id,
          resData.paymentDate,
          resData.amount,
          resData.paymentMethod,
          resData.payeeName
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
        this.addPayment(payments, debtorId, fetchedToken);
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

  addPayment(payment: Payment, debtorId, fetchedToken) {
    console.log(payment);
    const newPayment = new Payment(
      Math.random().toString(),
      payment.paymentDate,
      payment.amount,
      payment.paymentMethod,
      payment.payeeName
    );
    this.http
      .post(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments/${debtorId}.json?auth=${fetchedToken}`,
        { ...newPayment, id: null }
      )
      .subscribe((res) => {});
  }
  updatePayment(
    debtorId: string,
    paymentDate: Date,
    amount: number,
    paymentMethod: string,
    name: string
  ) {
    let updatePayment: Payment[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.payment;
      }),
      take(1),
      switchMap((user) => {
        if (!user || user.length <= 0) {
          return this.fetchPayments(debtorId);
        } else {
          return of(user);
        }
      }),
      switchMap((user) => {
        const updatePaymentIndex = user.findIndex((pl) => pl.id === debtorId);
        updatePayment = [...user];
        const oldUser = updatePayment[updatePaymentIndex];

        updatePayment[updatePaymentIndex] = new Payment(
          oldUser.id,
          paymentDate,
          amount,
          paymentMethod,
          name
        );
        return this.http.put<Payment>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments/${debtorId}.json?auth=${fetchedToken}`,
          { ...updatePayment[updatePaymentIndex], id: null }
        );
      }),
      tap(() => {
        this._payment.next(updatePayment);
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
