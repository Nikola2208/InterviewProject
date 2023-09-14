import { OrderLine } from "./OrderLine";

export interface OrderCreation {
    name: string;
    groups: OrderLine[];
}