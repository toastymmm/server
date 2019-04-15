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
    const messages: any = await this.http.get(`http://toastymmm.hopto.org/api/messages`).toPromise();
    this.allMessages = messages.map(m => ({
      id: m._id,
      text: m.feature.properties.text,
      category: m.feature.properties.category,
      date: new Date(m.feature.properties.date),
      numReports: m.feature.properties.numReports,
      userId: m.creator
    }));
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
    await this.http.patch(`http://toastymmm.hopto.org/api/message/${message.id}`, {
      numReports: 0,
    }).toPromise();
  }

  public async editMessage(message: Message, text: string) {
    message.text = text;
    await this.http.patch(`http://toastymmm.hopto.org/api/message/${message.id}`, {
      feature: {
        properties: {
          text
        }
      }
    }).toPromise();
  }

  public async deleteMessage(message: Message) {
    this.allMessages.splice(this.allMessages.indexOf(message), 1);
    await this.http.delete(`http://toastymmm.hopto.org/api/message/${message.id}`).toPromise();
  }
}
