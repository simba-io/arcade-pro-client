export interface UserData
{
    auth: UserAuthenticationData;
    player: UserPlayerData;
}

export interface UserAuthenticationData
{
    uid: string;
    displayName: string;
    email: string;
}

export interface UserPlayerData
{
    uid: string;
    displayName: string;
    wins: number;
    losses: number;
    rank: number;
    funds: number;
}