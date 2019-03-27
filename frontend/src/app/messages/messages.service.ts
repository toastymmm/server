import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {Message} from './message.model';
import {Subject} from 'rxjs';
import {User} from '../users/user.model';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  public messages: Subject<Message[]>;
  public user: User;

  private allMessages: Message[];

  constructor(private http: HttpClient) {
    this.messages = new Subject<Message[]>();
  }

  public async getMessages() {
    this.allMessages = [
      {
        id: 1,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a lorem vel ligula cursus tristique. Vestibulum sodales purus neque, non rutrum massa lobortis quis. Mauris bibendum magna leo, ut hendrerit mauris sollicitudin in. Nulla pulvinar, est a convallis tristique, lectus nisi tempus lacus, in malesuada mauris felis ut neque. Ut sit amet lacus orci. Praesent ac elit odio. Sed eget diam id tellus semper porta sit amet vulputate turpis. Nullam non risus quam. Nulla varius interdum nisi.',
        category: 'Test',
        date: new Date(),
        numReports: 0,
        userId: 1,
      },
      {
        id: 2,
        text: 'Nulla vestibulum dignissim sagittis. Duis non vehicula elit. Integer porta id dui a hendrerit. Proin vitae diam in risus mattis euismod quis sit amet metus. Sed fringilla est eget turpis ultrices vestibulum. Praesent feugiat imperdiet felis, at facilisis tortor maximus in. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut purus vestibulum justo euismod sagittis at id neque. Pellentesque sed nulla quis massa pretium finibus commodo commodo sem. Aenean scelerisque pharetra tellus at condimentum. Mauris scelerisque fermentum pretium. Vivamus mollis finibus placerat. Proin eleifend odio id arcu gravida, lacinia commodo sapien finibus. Nam quis nisl ac lorem suscipit euismod. Praesent augue urna, commodo faucibus facilisis sed, tempus id velit. Aliquam hendrerit mauris sit amet sem dignissim dignissim.',
        category: 'Test',
        date: new Date(),
        numReports: 3,
        userId: 2,
      },
    ];
    this.clearFilter();
  }

  public filterMessagesByUser(user: User) {
    this.user = user;
    this.messages.next(this.allMessages.filter(m => m.userId === user.id));
  }

  public filterMessagesByReported() {
    this.messages.next(this.allMessages.filter(m => m.numReports > 0));
  }

  public clearFilter() {
    this.user = null;
    this.messages.next(this.allMessages);
  }

  public async removeReports(message: Message) {
    message.numReports = 0;
    await this.http.patch(`/api/message/${message.id}`, {
      numReports: 0,
    }).toPromise();
  }

  public async editMessage(message: Message, text: string) {
    message.text = text;
    await this.http.patch(`/api/message/${message.id}`, {
      text,
    }).toPromise();
  }

  public async deleteMessage(message: Message) {
    this.allMessages.splice(this.allMessages.indexOf(message), 1);
    await this.http.delete(`/api/message/${message}`).toPromise();
  }
}
