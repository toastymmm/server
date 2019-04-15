import {Injectable} from '@angular/core';
import {User} from './user.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {
  }

  public async getUsers(): Promise<User[]> {
    const users: any = await this.http.get(`http://toastymmm.hopto.org/api/users`).toPromise();
    return users.map(u => ({
      id: u._id,
      username: u.username,
      created: new Date(u.accountCreated),
      lastLogin: new Date(u.lastLogin),
      messagesCreated: u.messagesCreatedCount,
      messagesFound: u.messagesFoundCount,
      warningCount: u.numWarnings,
      reportCount: u.numReports,
      banned: u.banned,
    }));
  }

  public async warnUser(user: User) {
    user.warningCount++;

    await this.http.patch(`http://toastymmm.hopto.org/api/user/${user.id}`, {
      warned: true,
      numWarnings: user.warningCount, // TODO: race condition, should be handled server-side
    }).toPromise();
  }

  public async banUser(user: User) {
    user.banned = true;

    await this.http.patch(`http://toastymmm.hopto.org/api/user/${user.id}`, {
      banned: true,
    }).toPromise();
  }
}
