import {Component} from '@angular/core';
import {IModalDialogOptions, ModalDialog} from '../../modals/dialog.interface';
import {User} from '../user.model';
import {UsersService} from '../users.service';

@Component({
  selector: 'warn-dialog',
  template: `
    <div class="modal-body">
      Are you sure you would like to warn {{user.username}}?
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline" (click)="close()">Cancel</button>
      <button type="button" class="btn btn-warning" [clrLoading]="loading" (click)="warnUser()">Warn</button>
    </div>
  `
})
export class WarnDialogComponent extends ModalDialog {
  user: User;
  loading = false;

  constructor(private usersService: UsersService) {
    super();

    this.title = 'Warn user';
  }

  public initDialog(options?: IModalDialogOptions) {
    this.user = options.data.user;
  }

  async warnUser() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    await this.usersService.warnUser(this.user);
    this.close(true);
  }
}
