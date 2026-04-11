export interface UserDataProps {
  email: string;
  uuid: string;
  userName: string;
  wins: number;
  losses: number;
  pushes: number;
  wallet: number;
}

export class UserData {
  data: UserDataProps;

  constructor(_data: UserDataProps) {
    this.data = _data;
  }
}
