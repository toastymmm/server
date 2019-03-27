import {Component, OnInit} from '@angular/core';
import {User} from './user.model';
import {UsersService} from './users.service';
import {ModalDialogService} from '../modals/dialog.service';
import {WarnDialogComponent} from './dialogs/warn-dialog.component';
import {BanDialogComponent} from './dialogs/ban-dialog.component';
import {MessagesService} from '../messages/messages.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(private usersService: UsersService,
              private messagesService: MessagesService,
              private modalService: ModalDialogService) {

  }

  async ngOnInit() {
    this.users = await this.usersService.getUsers();
  }

  async warnUser(user: User) {
    await this.modalService.openDialog(WarnDialogComponent, {
      data: {
        user
      }
    });
  }

  async banUser(user: User) {
    await this.modalService.openDialog(BanDialogComponent, {
      data: {
        user
      }
    });
  }

  showMessages(user: User) {
    this.messagesService.filterMessagesByUser(user);
  }
}
