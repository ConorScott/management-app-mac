/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Donation } from './donation.model';

interface DonationData {
  id: string;
  donationDate: Date;
  donationType: string;
  donationDesc: string;
  payeeName: string;
  amount?: number
 }

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private _donation = new BehaviorSubject<Donation[]>([]);

  get donation() {
    return this._donation.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) { }

  addDonation(donationDate: Date, donationType: string, donationDesc: string, payeeName: string, amount?: number) {
    let generateId: string;
    let newDonation: Donation;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newDonation = new Donation(Math.random().toString(), donationDate, donationType, donationDesc, payeeName, amount);
        return this.http.post<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/donations.json?auth=${token}`,
          { ...newDonation, id: null }
        );
      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.donation;
      }),
      take(1),
      tap((donation) => {
        newDonation.id = generateId;
        this._donation.next(donation.concat(newDonation));
      })
    );
  }

  fetchDonations() {

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.get<{ [key: string]: DonationData }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/donations.json?auth=${token}`
        )),
      map((resData) => {
        const donation = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            donation.push(new Donation(
              key,
              resData[key].donationDate,
              resData[key].donationType,
              resData[key].donationDesc,
              resData[key].payeeName,
              resData[key].amount,
              ));
          }
        }
        return donation.reverse();
      }),
      tap((donation) => {
        this._donation.next(donation);
      })
    );
  }

  getDonations(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.get<DonationData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/donations/${id}.json?auth=${token}`
        )),
      map((resData) => new Donation(
         id,
         resData.donationDate,
         resData.donationType,
         resData.donationDesc,
         resData.payeeName,
         resData.amount
         ))
    );
  }

  updateDonation(donationId: string, donationDate: Date, donationType: string, donationDesc: string, payeeName: string, amount?: number) {
    let updateDonation: Donation[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.donation;
      }),
      take(1),
      switchMap((donation) => {
        if (!donation || donation.length <= 0) {
          return this.fetchDonations();
        } else {
          return of(donation);
        }
      }),
      switchMap((donation) => {
        const updateDonationIndex = donation.findIndex(
          (pl) => pl.id === donationId
        );
        updateDonation = [...donation];
        const oldDonation = updateDonation[updateDonationIndex];

        updateDonation[updateDonationIndex] = new Donation(
          oldDonation.id,
          donationDate,
          donationType,
          donationDesc,
          payeeName,
          amount
        );
        return this.http.put<Donation>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/donations/${donationId}.json?auth=${fetchedToken}`,
          { ...updateDonation[updateDonationIndex], id: null }
        );
      }),
      tap(() => {
        this._donation.next(updateDonation);
      })
    );
  }

  deleteDonation(donationId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/donations/${donationId}.json?auth=${token}`
        )),
      switchMap(() => this.donation),
      take(1),
      tap((donation) => {
        this._donation.next(donation.filter((b) => b.id !== donationId));
      })
    );
  }
}
