/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { ConnectionStatus, NetworkService } from 'src/app/services/network.service';
import { OfflineManagerService } from 'src/app/services/offline-manager.service';
import { StorageService } from 'src/app/services/storage-service.service';
import { DebtorService } from '../../debtors/debtor.service';
import { Invoice } from './invoice.model';

interface InvoiceData {
  deceasedName: string;
  responsible: string;
  invoiceDate: Date;
  services: string;
  servicesPrice: number;
  coffinDetails: string;
  coffinPrice: number;
  stockLocation: string;
  casketCover: string;
  casketCoverPrice: number;
  coronerDoctorCert: string;
  coronerDoctorCertPrice: number;
  cremation: string;
  cremationPrice: number;
  urn: string;
  urnPrice: number;
  churchOfferring: string;
  churchOfferringPrice: number;
  sacristian: string;
  sacristianPrice: number;
  flowers: string;
  flowersPrice: number;
  graveOpen: string;
  graveOpenPrice: number;
  gravePurchaseToCouncil: string;
  gravePurchasePrice: number;
  graveMarker: string;
  graveMarkerPrice: number;
  graveMatsTimbers: string;
  graveMatsTimbersPrice: number;
  cloths: string;
  clothsPrice: number;
  hairdresser: string;
  hairdresserPrice: number;
  radioDeathNotices: string;
  radioNoticePrice: number;
  paperDeathNotices: string;
  paperNoticePrice: number;
  organist: string;
  organistPrice: number;
  soloist: string;
  soloistPrice: number;
  otherDetails: string;
  otherDetailsPrice: number;
  totalBalance: number;
  address1: string;
  address2: string;
  address3: string;
  county: string;
  createdBy: string;
  deathDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private _invoice = new BehaviorSubject<Invoice[]>([]);

  get invoice() {
    return this._invoice.asObservable();
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private debtorService: DebtorService,
    private networkService: NetworkService,
    private offlineManager: OfflineManagerService,
    private storageService: StorageService, private apiService: ApiService
  ) {}

  addInvoice(
    deceasedName: string,
    responsible: string,
    invoiceDate: Date,
    services: string,
    servicesPrice: number,
    coffinDetails: string,
    coffinPrice: number,
    stockLocation: string,
    casketCover: string,
    casketCoverPrice: number,
    coronerDoctorCert: string,
    coronerDoctorCertPrice: number,
    cremation: string,
    cremationPrice: number,
    urn: string,
    urnPrice: number,
    churchOfferring: string,
    churchOfferringPrice: number,
    sacristian: string,
    sacristianPrice: number,
    flowers: string,
    flowersPrice: number,
    graveOpen: string,
    graveOpenPrice: number,
    gravePurchaseToCouncil: string,
    gravePurchasePrice: number,
    graveMarker: string,
    graveMarkerPrice: number,
    graveMatsTimbers: string,
    graveMatsTimbersPrice: number,
    cloths: string,
    clothsPrice: number,
    hairdresser: string,
    hairdresserPrice: number,
    radioDeathNotices: string,
    radioNoticePrice: number,
    paperDeathNotices: string,
    paperNoticePrice: number,
    organist: string,
    organistPrice: number,
    soloist: string,
    soloistPrice: number,
    otherDetails: string,
    otherDetailsPrice: number,
    totalBalance: number,
    address1: string,
    address2: string,
    address3: string,
    county: string,
    createdBy: string,
    deathDate: string
  ) {
    let generateId: string;
    let newInvoice: Invoice;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        if (!fetchedUserId) {
          throw new Error('No user id found!');
        }
        newInvoice = new Invoice(
          Math.random().toString(),
          deceasedName,
          responsible,
          invoiceDate,
          services,
          servicesPrice,
          coffinDetails,
          coffinPrice,
          stockLocation,
          casketCover,
          casketCoverPrice,
          coronerDoctorCert,
          coronerDoctorCertPrice,
          cremation,
          cremationPrice,
          urn,
          urnPrice,
          churchOfferring,
          churchOfferringPrice,
          sacristian,
          sacristianPrice,
          flowers,
          flowersPrice,
          graveOpen,
          graveOpenPrice,
          gravePurchaseToCouncil,
          gravePurchasePrice,
          graveMarker,
          graveMarkerPrice,
          graveMatsTimbers,
          graveMatsTimbersPrice,
          cloths,
          clothsPrice,
          hairdresser,
          hairdresserPrice,
          radioDeathNotices,
          radioNoticePrice,
          paperDeathNotices,
          paperNoticePrice,
          organist,
          organistPrice,
          soloist,
          soloistPrice,
          otherDetails,
          otherDetailsPrice,
          totalBalance,
          address1,
          address2,
          address3,
          county,
          createdBy,
          deathDate
        );
        let url =`https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/invoices.json?auth=${token}`;
        let data = {...newInvoice, id: null};
        if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
          return from(this.offlineManager.storeRequest(url, 'POST', data));
        } else {
          return this.http.post<{ name: string }>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/invoices.json?auth=${token}`,
            { ...newInvoice, id: null }
          );
        }

      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.invoice;
      }),
      take(1),
      tap((invoice) => {
        newInvoice.id = generateId;
        this.debtorService.addDebtor(
          newInvoice.id,
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
          totalBalance
        ).subscribe();
        // eslint-disable-next-line no-underscore-dangle
        this._invoice.next(invoice.concat(newInvoice));
      })
    );
  }

  fetchInvoices() {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.apiService.getLocalData('invoices'))
    } else {
      let fetchedUserId: string;
      return this.authService.userId.pipe(
        take(1),
        switchMap((userId) => {
          if (!userId) {
            throw new Error('User not found!');
          }
          fetchedUserId = userId;
          return this.authService.token;
        }),
        take(1),
        switchMap((token) => {
          return this.http.get<{ [key: string]: InvoiceData }>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/invoices.json?auth=${token}`
          );
        }),
        map((invoiceData) => {
          const invoices = [];
          for (const key in invoiceData) {
            if (invoiceData.hasOwnProperty(key)) {
              invoices.push(
                new Invoice(
                  key,
                  invoiceData[key].deceasedName,
                  invoiceData[key].responsible,
                  invoiceData[key].invoiceDate,
                  invoiceData[key].services,
                  invoiceData[key].servicesPrice,
                  invoiceData[key].coffinDetails,
                  invoiceData[key].coffinPrice,
                  invoiceData[key].stockLocation,
                  invoiceData[key].casketCover,
                  invoiceData[key].casketCoverPrice,
                  invoiceData[key].coronerDoctorCert,
                  invoiceData[key].coronerDoctorCertPrice,
                  invoiceData[key].cremation,
                  invoiceData[key].cremationPrice,
                  invoiceData[key].urn,
                  invoiceData[key].urnPrice,
                  invoiceData[key].churchOfferring,
                  invoiceData[key].churchOfferringPrice,
                  invoiceData[key].sacristian,
                  invoiceData[key].sacristianPrice,
                  invoiceData[key].flowers,
                  invoiceData[key].flowersPrice,
                  invoiceData[key].graveOpen,
                  invoiceData[key].graveOpenPrice,
                  invoiceData[key].gravePurchaseToCouncil,
                  invoiceData[key].gravePurchasePrice,
                  invoiceData[key].graveMarker,
                  invoiceData[key].graveMarkerPrice,
                  invoiceData[key].graveMatsTimbers,
                  invoiceData[key].graveMatsTimbersPrice,
                  invoiceData[key].cloths,
                  invoiceData[key].clothsPrice,
                  invoiceData[key].hairdresser,
                  invoiceData[key].hairdresserPrice,
                  invoiceData[key].radioDeathNotices,
                  invoiceData[key].radioNoticePrice,
                  invoiceData[key].paperDeathNotices,
                  invoiceData[key].paperNoticePrice,
                  invoiceData[key].organist,
                  invoiceData[key].organistPrice,
                  invoiceData[key].soloist,
                  invoiceData[key].soloistPrice,
                  invoiceData[key].otherDetails,
                  invoiceData[key].otherDetailsPrice,
                  invoiceData[key].totalBalance,
                  invoiceData[key].address1,
                  invoiceData[key].address2,
                  invoiceData[key].address3,
                  invoiceData[key].county,
                  invoiceData[key].createdBy,
                  invoiceData[key].deathDate
                )
              );
            }
          }
          return invoices.reverse();
        }),
        tap((invoices) => {
          this.apiService.setLocalData('invoices', invoices);
          this._invoice.next(invoices);
        })
      );
    }

  }
  getInvoices(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<InvoiceData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/invoices/${id}.json?auth=${token}`
        );
      }),
      map((resData) => {
        return new Invoice(
          id,
          resData.deceasedName,
          resData.responsible,
          resData.invoiceDate,
          resData.services,
          resData.servicesPrice,
          resData.coffinDetails,
          resData.coffinPrice,
          resData.stockLocation,
          resData.casketCover,
          resData.casketCoverPrice,
          resData.coronerDoctorCert,
          resData.coronerDoctorCertPrice,
          resData.cremation,
          resData.cremationPrice,
          resData.urn,
          resData.urnPrice,
          resData.churchOfferring,
          resData.churchOfferringPrice,
          resData.sacristian,
          resData.sacristianPrice,
          resData.flowers,
          resData.flowersPrice,
          resData.graveOpen,
          resData.graveOpenPrice,
          resData.gravePurchaseToCouncil,
          resData.gravePurchasePrice,
          resData.graveMarker,
          resData.graveMarkerPrice,
          resData.graveMatsTimbers,
          resData.graveMatsTimbersPrice,
          resData.cloths,
          resData.clothsPrice,
          resData.hairdresser,
          resData.hairdresserPrice,
          resData.radioDeathNotices,
          resData.radioNoticePrice,
          resData.paperDeathNotices,
          resData.paperNoticePrice,
          resData.organist,
          resData.organistPrice,
          resData.soloist,
          resData.soloistPrice,
          resData.otherDetails,
          resData.otherDetailsPrice,
          resData.totalBalance,
          resData.address1,
          resData.address2,
          resData.address3,
          resData.county,
          resData.createdBy,
          resData.deathDate
        );
      })
    );
  }

  updateInvoice(
    invoiceId: string,
    deceasedName: string,
    responsible: string,
    invoiceDate: Date,
    services: string,
    servicesPrice: number,
    coffinDetails: string,
    coffinPrice: number,
    stockLocation: string,
    casketCover: string,
    casketCoverPrice: number,
    coronerDoctorCert: string,
    coronerDoctorCertPrice: number,
    cremation: string,
    cremationPrice: number,
    urn: string,
    urnPrice: number,
    churchOfferring: string,
    churchOfferringPrice: number,
    sacristian: string,
    sacristianPrice: number,
    flowers: string,
    flowersPrice: number,
    graveOpen: string,
    graveOpenPrice: number,
    gravePurchaseToCouncil: string,
    gravePurchasePrice: number,
    graveMarker: string,
    graveMarkerPrice: number,
    graveMatsTimbers: string,
    graveMatsTimbersPrice: number,
    cloths: string,
    clothsPrice: number,
    hairdresser: string,
    hairdresserPrice: number,
    radioDeathNotices: string,
    radioNoticePrice: number,
    paperDeathNotices: string,
    paperNoticePrice: number,
    organist: string,
    organistPrice: number,
    soloist: string,
    soloistPrice: number,
    otherDetails: string,
    otherDetailsPrice: number,
  ) {
    const totalBalance =
      servicesPrice +
      coffinPrice +
      casketCoverPrice +
      coronerDoctorCertPrice +
      cremationPrice +
      urnPrice +
      churchOfferringPrice +
      sacristianPrice +
      flowersPrice +
      graveOpenPrice +
      gravePurchasePrice +
      graveMarkerPrice +
      graveMatsTimbersPrice +
      clothsPrice +
      hairdresserPrice +
      radioNoticePrice +
      paperNoticePrice +
      organistPrice +
      soloistPrice +
      otherDetailsPrice;
    let updateInvoiceInfo: Invoice[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.invoice;
      }),
      take(1),
      switchMap((invoice) => {
        if (!invoice || invoice.length <= 0) {
          return this.fetchInvoices();
        } else {
          return of(invoice);
        }
      }),
      switchMap((invoices) => {
        const updateInvoiceIndex = invoices.findIndex(
          (pl) => pl.id === invoiceId
        );
        updateInvoiceInfo = [...invoices];
        const oldInvoiceInfo = updateInvoiceInfo[updateInvoiceIndex];
        updateInvoiceInfo[updateInvoiceIndex] = new Invoice(
          oldInvoiceInfo.id,
          deceasedName,
          responsible,
          invoiceDate,
          services,
          servicesPrice,
          coffinDetails,
          coffinPrice,
          stockLocation,
          casketCover,
          casketCoverPrice,
          coronerDoctorCert,
          coronerDoctorCertPrice,
          cremation,
          cremationPrice,
          urn,
          urnPrice,
          churchOfferring,
          churchOfferringPrice,
          sacristian,
          sacristianPrice,
          flowers,
          flowersPrice,
          graveOpen,
          graveOpenPrice,
          gravePurchaseToCouncil,
          gravePurchasePrice,
          graveMarker,
          graveMarkerPrice,
          graveMatsTimbers,
          graveMatsTimbersPrice,
          cloths,
          clothsPrice,
          hairdresser,
          hairdresserPrice,
          radioDeathNotices,
          radioNoticePrice,
          paperDeathNotices,
          paperNoticePrice,
          organist,
          organistPrice,
          soloist,
          soloistPrice,
          otherDetails,
          otherDetailsPrice,
          totalBalance,
          oldInvoiceInfo.address1,
          oldInvoiceInfo.address2,
          oldInvoiceInfo.address3,
          oldInvoiceInfo.county,
          oldInvoiceInfo.createdBy,
          oldInvoiceInfo.deathDate
        );
        return this.http.put(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/invoices/${invoiceId}.json?auth=${fetchedToken}`,
          { ...updateInvoiceInfo[updateInvoiceIndex], id: null }
        );
      }),
      tap(() => {
        // eslint-disable-next-line no-underscore-dangle
        this._invoice.next(updateInvoiceInfo);
      })
    );
  }

  cancelBooking(invoiceId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/invoices/${invoiceId}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.invoice;
      }),
      take(1),
      tap((invoice) => {
        this._invoice.next(invoice.filter((b) => b.id !== invoiceId));
      })
    );
  }
}
