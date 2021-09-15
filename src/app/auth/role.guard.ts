import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { UserService } from '../menu/users/user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  role: string;

  constructor(private userService: UserService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // return this.userService.getUserName().subscribe(user => {
    //   user.map(role => {
    //     this.role = role.role;
    //     return true;
    //   })
    // })
    return this.userService.getUserName().pipe(take(1),switchMap( user => user.map(role => {
      if (role.role !== 'staff' && window.screen.width < 1025) {
        return true;
      } else if (role.role === 'admin' &&  window.screen.width >= 1025 || role.role === 'staff' && window.screen.width >= 1025){
        return true;
      }
      console.log('denied');
      this.router.navigateByUrl('/menu/tabs/calendar');
      return false;

    })));
  }

}
