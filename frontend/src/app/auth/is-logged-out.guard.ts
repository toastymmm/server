import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedOutGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(): boolean {
    if (this.auth.isAuthenticated) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
