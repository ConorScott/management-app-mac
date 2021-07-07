import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public isVisible = new BehaviorSubject<boolean>(true);
  cast = this.isVisible.asObservable();

  constructor() { }

  changeToggle() {
    this.isVisible.next(!this.isVisible.value);
    return this.isVisible.value;
    console.log(this.isVisible.value);
  }
}
