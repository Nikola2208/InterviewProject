import { GroupMain } from "./GroupMain";
import { OrderMain } from "./OrderMain";

export interface StackResponse {
    id: number;
    name: string;
    items_per_stack: number;
    order: OrderMain;
    group: GroupMain;
}