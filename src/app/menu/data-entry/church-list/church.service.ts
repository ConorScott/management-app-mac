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
import { Church } from './church.model';

interface ChurchData {
  churchName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChurchService {
  private _church = new BehaviorSubject<Church[]>([]);

  get church(){
    return this._church.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService, private networkService: NetworkService,
    private offlineManager: OfflineManagerService,
    private storageService: StorageService, private apiService: ApiService) { }

  addChurch(churchName: string) {

    let generateId: string;
    let newChurch: Church;
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
        newChurch = new Church(
          Math.random().toString(),
          churchName
        );
        let url =`https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/churches.json?auth=${token}`;
        if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
          return from(this.offlineManager.storeRequest(url, 'POST'));
        } else {
          return this.http
        .post<{name: string}>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/churches.json?auth=${token}`,
          { ...newChurch, id: null }
        );
        }

      }),switchMap((resData) => {
        generateId = resData.name;
        return this.church;
      }),
      take(1),
      tap((church) => {
        newChurch.id = generateId;
        this._church.next(church.concat(newChurch));
      })
    );
  }

  fetchChurches() {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.apiService.getLocalData('church'))
    } else {
      return this.authService.token.pipe(take(1), switchMap(token => {
        return this.http
        .get<{ [key: string]: ChurchData }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/churches.json?auth=${token}`
        );
      }),
          map((resData) => {
            const church = [];
            for (const key in resData) {
              if (resData.hasOwnProperty(key)) {
                church.push(
                  new Church(
                    key,
                    resData[key].churchName,
                  )
                );
              }
            }
            return church;
          }),
          tap((church) => {
            this.apiService.setLocalData('church ', church);
            this._church.next(church);
          })
        );
    }

  }

  getChurch(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<ChurchData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/churches/${id}.json?auth=${token}`
        );
      }),
      map((resData) => {
        return new Church(
          id,
          resData.churchName
        );
      })
    );
  }

  updateChurch(churchId: string, churchName: string) {
    let updateChurch: Church[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.church;
      }),
      take(1),
      switchMap((church) => {
        if (!church || church.length <= 0) {
          return this.fetchChurches();
        } else {
          return of(church);
        }
      }),
      switchMap((church) => {
        const updateChurchIndex = church.findIndex((pl) => pl.id === churchId);
        updateChurch = [...church];
        const oldchurch = updateChurch[updateChurchIndex];

        updateChurch[updateChurchIndex] = new Church(
          oldchurch.id,
          churchName
        );
        return this.http.put<Church>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/churches/${churchId}.json?auth=${fetchedToken}`,
          { ...updateChurch[updateChurchIndex], id: null }
        );
      }),
      tap(() => {
        this._church.next(updateChurch);
      })
    );
  }

  deleteChurch(churchId: string){
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http.delete(`https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/churches/${churchId}.json?auth=${token}`
      );
    }),
    switchMap(() => {
      return this.church;
    }),
    take(1),
     tap(church => {
      this._church.next(church.filter((b) => b.id !== churchId));
    }));
  }
}