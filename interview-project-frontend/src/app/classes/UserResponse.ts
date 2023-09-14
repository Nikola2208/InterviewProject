import { Account } from "./Account";
import { Address } from "./Address";

export interface UserResponse {
    id : number;
    name : string;
    surname : string;
    role : string;
    account : Account;
    address : Address;
}