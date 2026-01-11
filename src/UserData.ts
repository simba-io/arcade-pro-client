export class UserData {
  user: string;
  wins: number;
  losses: number;
  pushes: number;
  wallet: number;

  constructor(user: string, wins: number = 0, losses: number = 0, pushes: number = 0, wallet: number = 0) {
    this.user = user;
    this.wins = wins;
    this.losses = losses;
    this.pushes = pushes;
    this.wallet = wallet;
  }

  toJSON() {
    return {
      user: this.user,
      wins: this.wins,
      losses: this.losses,
      pushes: this.pushes,
      wallet: this.wallet,
    };
  }
}
