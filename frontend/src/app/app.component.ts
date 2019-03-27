import {Component, ViewContainerRef} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {ModalDialogService} from './modals/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public auth: AuthService, private modalService: ModalDialogService, private viewRef: ViewContainerRef) {
    this.modalService.setViewContainer(viewRef);
  }
}
