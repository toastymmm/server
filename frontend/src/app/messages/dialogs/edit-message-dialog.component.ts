import {Component} from '@angular/core';
import {IModalDialogOptions, ModalDialog} from '../../modals/dialog.interface';
import {MessagesService} from '../messages.service';
import {Message} from '../message.model';

@Component({
  selector: 'edit-message-dialog',
  template: `
    <div class="modal-body">
      <textarea [(ngModel)]="text" name="text" required></textarea>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline" (click)="close()">Cancel</button>
      <button type="button" class="btn btn-primary" [clrLoading]="loading" (click)="save()">Save</button>
    </div>
  `,
  styles: [`
    textarea {
      width: 100%;
      margin-top: 10px !important;
    }
  `]
})
export class EditMessageDialogComponent extends ModalDialog {
  text: string;
  message: Message;
  loading = false;

  constructor(private messagesServices: MessagesService) {
    super();

    this.title = 'Edit Message';
  }

  public initDialog(options?: IModalDialogOptions) {
    this.message = options.data.message;
    this.text = this.message.text;
  }

  async save() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    await this.messagesServices.editMessage(this.message, this.text);
    this.close(true);
  }
}
