/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Payment } from 'src/app/shared/payment.model';

interface PaymentData {
  id: string;
  paymentId: string;
  paymentDate: Date;
  amount: number;
  paymentMethod: string;
  payeeName: string;
  deceasedName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private _payment = new BehaviorSubject<Payment[]>([]);
  private _payments = new BehaviorSubject<Payment[]>([]);
  // private _payments = new BehaviorSubject<Payment[]>([]);

  get payment() {
    return this._payment.asObservable();
  }

  get payments() {
    return this._payments.asObservable();
  }
  constructor(private http: HttpClient, private authService: AuthService) { }

  addPayment(payment: Payment, debtorId) {
    let generatedId: string;
    let newPayment: Payment;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No User Id Found');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newPayment = new Payment(
          Math.random().toString(),
          debtorId,
          payment.paymentDate,
          payment.amount,
          payment.paymentMethod,
          payment.payeeName,
          payment.deceasedName
        );
        return this.http
      .post<{name: string}>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments.json?auth=${token}`,
        { ...newPayment, id: null }
      );
      }),switchMap((resData) => {
        generatedId = resData.name;
        return this.payment;
      }),
      take(1),
      tap((payments) => {
        newPayment.id = generatedId;
        this._payment.next(payments.concat(newPayment));
      })
    );
  }

  addPayments(payment: Payment, debtorId, deceasedName) {
    let generatedId: string;
    let newPayment: Payment;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No User Id Found');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newPayment = new Payment(
          Math.random().toString(),
          debtorId,
          payment.paymentDate,
          payment.amount,
          payment.paymentMethod,
          payment.payeeName,
          deceasedName
        );
        return this.http
      .post<{name: string}>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments.json?auth=${token}`,
        { ...newPayment, id: null }
      );
      }),switchMap((resData) => {
        generatedId = resData.name;
        return this.payment;
      }),
      take(1),
      tap((payments) => {
        newPayment.id = generatedId;
        this._payment.next(payments.concat(newPayment));
      })
    );
  }

  updatePayment(
    debtorId: string,
    paymentDate: Date,
    amount: number,
    paymentMethod: string,
    name: string,
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
          oldUser.paymentId,
          paymentDate,
          amount,
          paymentMethod,
          name,
          oldUser.deceasedName
        );
        return this.http.put<Payment>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments/${debtorId}.json?auth=${fetchedToken}`,
          { ...updatePayment[updatePaymentIndex], id: null}
        );
      }),
      tap(() => {
        this._payment.next(updatePayment);
      })
    );
  }

  updatePayments(
    debtorId: string,
    paymentDate: Date,
    amount: number,
    paymentMethod: string,
    name: string
  ) {
    console.log(debtorId);
    let updatePayment: Payment[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.payments;
      }),
      take(1),
      switchMap((user) => {
        if (!user || user.length <= 0) {
          return this.fetchAllPayments();
        } else {
          return of(user);
        }
      }),
      switchMap((user) => {
        console.log([...user]);
        const updatePaymentIndex = user.findIndex((pl) => pl.id === debtorId);
        updatePayment = [...user];
        const oldUser = updatePayment[updatePaymentIndex];
        console.log('console log' + oldUser);

        updatePayment[updatePaymentIndex] = new Payment(
          oldUser.id,
          oldUser.paymentId,
          paymentDate,
          amount,
          paymentMethod,
          name,
          oldUser.deceasedName
        );
        return this.http.put<Payment>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments/${debtorId}.json?auth=${fetchedToken}`,
          { ...updatePayment[updatePaymentIndex], id: null}
        );
      }),
      tap(() => {
        this._payments.next(updatePayment);
      })
    );
  }

  fetchPayments(id: string) {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<{ [key: string]: PaymentData }>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments.json?auth=${token}`
      );
    }), map((resData) => {
      const payments = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key) &&
        resData[key].paymentId === id) {
          payments.push(
            new Payment(
              key,
              resData[key].paymentId,
              resData[key].paymentDate,
              resData[key].amount,
              resData[key].paymentMethod,
              resData[key].payeeName,
              resData[key].deceasedName
            )
          );
        }
      }
      return payments.reverse();
    }),
    tap((payment) => {
      this._payment.next(payment);
    })
    );
  }

  fetchDebtorPayments(id: string) {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<{ [key: string]: PaymentData }>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments.json?auth=${token}`
      );
    }), map((resData) => {
      const payments = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key) &&
        resData[key].paymentId === id) {
          payments.push(
            new Payment(
              key,
              resData[key].paymentId,
              resData[key].paymentDate,
              resData[key].amount,
              resData[key].paymentMethod,
              resData[key].payeeName,
              resData[key].deceasedName
            )
          );
        }
      }
      return payments.reverse();
    }),
    // tap((payment) => {
    //   this._payment.next(payment);
    // })
    );
  }

  fetchAllPayments() {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<{ [key: string]: PaymentData }>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments.json?auth=${token}`
      );
    }), map((resData) => {
      const payments = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          payments.push(
            new Payment(
              key,
              resData[key].paymentId,
              resData[key].paymentDate,
              resData[key].amount,
              resData[key].paymentMethod,
              resData[key].payeeName,
              resData[key].deceasedName
            )
          );
        }
      }
      return payments.reverse();
    }),
    tap((payment) => {
      this._payments.next(payment);
    })
    );
  }

  fetchCashPayments(method: string) {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<{ [key: string]: PaymentData }>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments.json?auth=${token}`
      );
    }), map((resData) => {
      const payments = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key) &&
        resData[key].paymentMethod === method) {
          payments.push(
            new Payment(
              key,
              resData[key].paymentId,
              resData[key].paymentDate,
              resData[key].amount,
              resData[key].paymentMethod,
              resData[key].payeeName,
              resData[key].deceasedName
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
          resData.paymentId,
          resData.paymentDate,
          resData.amount,
          resData.paymentMethod,
          resData.payeeName,
          resData.deceasedName
        );
      })
    );
  }

  deletePayment(paymentId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments/${paymentId}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.payment;
      }),
      take(1),
      tap((payment) => {
        this._payment.next(payment.filter((b) => b.id !== paymentId));
      })
    );
  }

  deletePayments(paymentId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments/${paymentId}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.payments;
      }),
      take(1),
      tap((payment) => {
        this._payments.next(payment.filter((b) => b.id !== paymentId));
      })
    );
  }
}
