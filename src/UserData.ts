export interface UserData
{
    auth: UserAuthenticationData;
    player: UserPlayerData;
}

export interface UserAuthenticationData
{
    uid: string;
    email: string;
}

export interface UserPlayerData
{
    uid: string;
    userName: string;
    wins: number;
    level: number;
    funds: number;
}

export class UserObject
{
    userData: UserData;

    constructor(userData: UserData)
    {
        this.userData = userData;
    }
}