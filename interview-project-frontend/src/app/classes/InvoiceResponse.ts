import { GroupMain } from "./GroupMain";
import { OrderMain } from "./OrderMain";
import { UserMain } from "./UserMain";

export interface InvoiceResponse {
    id: number;
    name: string;
    order: OrderMain;
    user: UserMain;
    invoice_groups: GroupMain[];
    invoice_groups_string: string;
}