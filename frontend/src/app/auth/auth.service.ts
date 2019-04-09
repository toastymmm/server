import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated = false;

  constructor(private router: Router, private http: HttpClient, private cookies: CookieService) {
    // Check if we are logged in already from an existing cookie.
    if (cookies.get('sid')) {
      this.isAuthenticated = true;
    }
  }

  public async login(username: string, password: string) {
    await this.http.post(`http://toastymmm.hopto.org/api/userLogin`, {
      username,
      password,
    }).toPromise();
    this.isAuthenticated = true;
    this.router.navigate(['']);
  }

  public async logout() {
    await this.http.post(`http://toastymmm.hopto.org/api/userLogout`, {}).toPromise();
    this.isAuthenticated = false;
    this.router.navigate(['login']);
  }
}
