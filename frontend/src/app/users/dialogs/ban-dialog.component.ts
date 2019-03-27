import {Component} from '@angular/core';
import {IModalDialogOptions, ModalDialog} from '../../modals/dialog.interface';
import {User} from '../user.model';
import {UsersService} from '../users.service';

@Component({
  selector: 'ban-dialog',
  template: `
    <div class="modal-body">
      Are you sure you would like to ban {{user.username}}?
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline" (click)="close()">Cancel</button>
      <button type="button" class="btn btn-warning" [clrLoading]="loading" (click)="banUser()">Ban</button>
    </div>
  `
})
export class BanDialogComponent extends ModalDialog {
  user: User;
  loading = false;

  constructor(private usersService: UsersService) {
    super();

    this.title = 'Ban user';
  }

  public initDialog(options?: IModalDialogOptions) {
    this.user = options.data.user;
  }

  async banUser() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    await this.usersService.banUser(this.user);
    this.close(true);
  }
}
