import {Component, OnInit} from '@angular/core';
import {ModalDialogService} from '../modals/dialog.service';
import {MessagesService} from './messages.service';
import {Message} from './message.model';
import {User} from '../users/user.model';
import {EditMessageDialogComponent} from './dialogs/edit-message-dialog.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  lastFilteredUser: User;

  constructor(public messagesService: MessagesService, private modalService: ModalDialogService) {
    this.messagesService.messages.subscribe(msgs => {
      if (this.messagesService.user) {
        this.lastFilteredUser = this.messagesService.user;
      }
      this.messages = [...msgs];
    });
  }

  async ngOnInit() {
    await this.messagesService.getMessages();
  }

  clearFilter() {
    this.lastFilteredUser = null;
    this.messagesService.clearFilter();
  }

  async removeReports(message: Message) {
    await this.messagesService.removeReports(message);
  }

  async deleteMessage(message: Message) {
    this.messages.splice(this.messages.indexOf(message), 1);
    await this.messagesService.deleteMessage(message);
  }

  async editMessage(message: Message) {
    await this.modalService.openDialog(EditMessageDialogComponent, {
      data: {
        message
      }
    });
  }
}
