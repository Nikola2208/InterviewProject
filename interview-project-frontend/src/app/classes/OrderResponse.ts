import { GroupMain } from "./GroupMain";
import { UserMain } from "./UserMain";

export interface OrderResponse {
    id: number;
    name: string;
    total_price: number;
    status: string;
    user: UserMain;
    groups: GroupMain[];
    groups_string: string;
}