/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { StoreUser } from './storeUser.model';
import firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment';
import { ConnectionStatus, NetworkService } from 'src/app/services/network.service';
import { OfflineManagerService } from 'src/app/services/offline-manager.service';
import { StorageService } from 'src/app/services/storage-service.service';
import { ApiService } from 'src/app/services/api.service';

interface UserData {
  id: string;
  uid: string;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user = new BehaviorSubject<StoreUser[]>([]);
  private secondaryApp = firebase.initializeApp(
    environment.firebaseConfig,
    'SecondaryApp'
  );
  get user() {
    return this._user.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient,private networkService: NetworkService,
    private offlineManager: OfflineManagerService,
    private storageService: StorageService, private apiService: ApiService) {}

  addUser(
    uid: string,
    email: string,
    password: string,
    name: string,
    role: string,
    createdAt: Date
  ) {
    let generateId: string;
    let newUser: StoreUser;
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
        newUser = new StoreUser(Math.random().toString(),uid, email, password, name, role, createdAt);
        let url =`https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${token}`;
        let data = {...newUser, id: null};
        if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
          return from(this.offlineManager.storeRequest(url, 'POST', data));
        } else {
          return this.http.post<{ name: string }>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${token}`,
            { ...newUser, id:null }
          );
        }

      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.user;
      }),
      take(1),
      tap((user) => {
        newUser.id = generateId;
        this._user.next(user.concat(newUser));
      })
    );
  }

  signup(
    email: string,
    password: string,
    name: string,
    role: string,
    createdAt: Date
  ) {
    return this.secondaryApp
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.secondaryApp.auth().signOut();
        return this.addUser(
          user.user.uid,
          email,
          password,
          name,
          role,
          createdAt
        ).subscribe(() => {
          this.secondaryApp.auth().signOut();
        });
      });
  }

  fetchUsers() {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.apiService.getLocalData('users'))
    } else {
      return this.authService.token.pipe(
        take(1),
        switchMap((token) => {
          return this.http.get<{ [key: string]: UserData }>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${token}`
          );
        }),
        map((resData) => {
          const user = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              user.push(
                new StoreUser(
                  key,
                  resData[key].uid,
                  resData[key].email,
                  resData[key].password,
                  resData[key].name,
                  resData[key].role,
                  resData[key].createdAt
                )
              );
            }
          }
          return user;
        }),
        tap((user) => {
          this.apiService.setLocalData('users', user);
          this._user.next(user);
        })
      );
    }

  }

  updateUser(
    userId: string,
    email: string,
    password: string,
    name: string,
    role: string
  ) {
    let updateUser: StoreUser[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.user;
      }),
      take(1),
      switchMap((user) => {
        if (!user || user.length <= 0) {
          return this.fetchUsers();
        } else {
          return of(user);
        }
      }),
      switchMap((user) => {
        const updateUserIndex = user.findIndex((pl) => pl.id === userId);
        updateUser = [...user];
        const oldUser = updateUser[updateUserIndex];

        updateUser[updateUserIndex] = new StoreUser(
          oldUser.id,
          oldUser.uid,
          email,
          password,
          name,
          role,
          oldUser.createdAt
        );
        return this.http.put<StoreUser>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json?auth=${fetchedToken}`,
          { ...updateUser[updateUserIndex], id: null }
        );
      }),
      tap(() => {
        this._user.next(updateUser);
      })
    );
  }
  getUser(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<UserData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json?auth=${token}`
        );
      }),
      map((resData) => {
        return new StoreUser(
          id,
          resData.uid,
          resData.email,
          resData.password,
          resData.name,
          resData.role,
          resData.createdAt
        );
      })
    );
  }

  getUserName() {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('USer not found!');
        }
        fetchedUserId = userId;
        console.log(fetchedUserId);
        return this.authService.token;

      }),
      take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: UserData }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${token}`
        );
      }),
      map((resData) => {
        const users = [];
        for(const key in resData){
          if(resData.hasOwnProperty(key) &&
          resData[key].uid === fetchedUserId){
            users.push(
              new StoreUser(
                resData[key].id,
                resData[key].uid,
                resData[key].email,
                resData[key].password,
                resData[key].name,
                resData[key].role,
                resData[key].createdAt
              )
            );
          }
        }
        return users;
      })
    );
  }

  deleteUser(userId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) =>
        this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json?auth=${token}`
        )
      ),
      // eslint-disable-next-line arrow-body-style
      switchMap(() => {
        return this.user;
      }),
      take(1),
      tap((user) => {
        // eslint-disable-next-line no-underscore-dangle
        this._user.next(user.filter((b) => b.id !== userId));
      })
    );
  }
}
