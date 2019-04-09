export class User {
  id: string;
  username: string;
  created: Date;
  lastLogin: Date;
  messagesCreated: number;
  messagesFound: number;
  warningCount: number;
  reportCount: number;
  banned?: boolean;
}
