import {Component} from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: any = {};
  error: string;
  loading = false;

  constructor(private auth: AuthService) {
  }

  public async login() {
    if (this.loading) {
      return;
    }

    try {
      this.loading = true;
      await this.auth.login(this.form.username, this.form.password);
    } catch (e) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  }
}
