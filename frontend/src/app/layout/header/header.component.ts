import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private auth: AuthService) {
  }

  async logout() {
    try {
      await this.auth.logout();
    } catch (e) {
      alert(e.message);
    }
  }
}
