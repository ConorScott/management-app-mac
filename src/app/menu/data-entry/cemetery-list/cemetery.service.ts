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
import { Cemetery } from './cemetery.model';

interface CemeteryData {
  cemeteryName: string;
}

@Injectable({
  providedIn: 'root',
})
export class CemeteryService {
  private _cemetery = new BehaviorSubject<Cemetery[]>([]);

  get cemetery() {
    return this._cemetery.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService, private networkService: NetworkService,
    private offlineManager: OfflineManagerService,
    private storageService: StorageService, private apiService: ApiService) {}

  addCemetery(cemeteryName: string) {
    let generateId: string;
    let newCemetery: Cemetery;
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
        newCemetery = new Cemetery(Math.random().toString(), cemeteryName);
        let url = `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/cemeterys.json?auth=${token}`;
        let data = {...newCemetery, id: null};
        if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
          return from(this.offlineManager.storeRequest(url, 'POST', data));
        } else {
          return this.http.post<{ name: string }>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/cemeterys.json?auth=${token}`,
            { ...newCemetery, id: null }
          );
        }

      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.cemetery;
      }),
      take(1),
      tap((cemetery) => {
        newCemetery.id = generateId;
        this._cemetery.next(cemetery.concat(newCemetery));
      })
    );
  }

  fetchCemeterys() {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.apiService.getLocalData('cemetery'))
    } else {
      return this.authService.token.pipe(
        take(1),
        switchMap((token) => {
          return this.http.get<{ [key: string]: CemeteryData }>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/cemeterys.json?auth=${token}`
          );
        }),
        map((resData) => {
          const cemetery = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              cemetery.push(new Cemetery(key, resData[key].cemeteryName));
            }
          }
          return cemetery;
        }),
        tap((cemetery) => {
          this.apiService.setLocalData('cemetery', cemetery);
          this._cemetery.next(cemetery);
        })
      );
    }

  }

  getCemeterys(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<CemeteryData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/cemeterys/${id}.json?auth=${token}`
        );
      }),
      map((resData) => {
        return new Cemetery(id, resData.cemeteryName);
      })
    );
  }

  updateCemetery(cemeteryId: string, cemeteryName: string) {
    let updateCemetery: Cemetery[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.cemetery;
      }),
      take(1),
      switchMap((cemetery) => {
        if (!cemetery || cemetery.length <= 0) {
          return this.fetchCemeterys();
        } else {
          return of(cemetery);
        }
      }),
      switchMap((cemetery) => {
        const updateCemeteryIndex = cemetery.findIndex(
          (pl) => pl.id === cemeteryId
        );
        updateCemetery = [...cemetery];
        const oldCemetery = updateCemetery[updateCemeteryIndex];

        updateCemetery[updateCemeteryIndex] = new Cemetery(
          oldCemetery.id,
          cemeteryName
        );
        return this.http.put<Cemetery>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/cemeterys/${cemeteryId}.json?auth=${fetchedToken}`,
          { ...updateCemetery[updateCemeteryIndex], id: null }
        );
      }),
      tap(() => {
        this._cemetery.next(updateCemetery);
      })
    );
  }

  deleteCemetery(cemeteryId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/cemeterys/${cemeteryId}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.cemetery;
      }),
      take(1),
      tap((cemetery) => {
        this._cemetery.next(cemetery.filter((b) => b.id !== cemeteryId));
      })
    );
  }
}
