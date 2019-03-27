export class User {
  id: number;
  username: string;
  created: Date;
  lastLogin: Date;
  messagesCreated: number;
  messagesFound: number;
  warningCount: number;
  reportCount: number;
  banned?: boolean;
}
