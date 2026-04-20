export interface UserData
{
    auth: UserAuthenticationData;
    player: UserPlayerData;
    payment: UserPaymentData;
}

export interface UserPaymentData
{
    uid: string;
    name: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    billingAddress: string;
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