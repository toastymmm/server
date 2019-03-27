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
    return [
      {
        id: 1,
        username: 'Test',
        created: new Date(),
        lastLogin: new Date(),
        messagesCreated: 0,
        messagesFound: 0,
        warningCount: 0,
        reportCount: 0,
      },
      {
        id: 2,
        username: 'Test 2',
        created: new Date(),
        lastLogin: new Date(),
        messagesCreated: 0,
        messagesFound: 0,
        warningCount: 3,
        reportCount: 0,
      }
    ];
  }

  public async warnUser(user: User) {
    user.warningCount++;

    await this.http.patch(`/api/user/${user.id}`, {
      warned: true,
    }).toPromise();
  }

  public async banUser(user: User) {
    user.banned = true;

    await this.http.patch(`/api/user/${user.id}`, {
      banned: true,
    }).toPromise();
  }
}
