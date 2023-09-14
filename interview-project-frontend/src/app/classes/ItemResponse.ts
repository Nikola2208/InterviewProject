import { Group } from "./Group";

export interface ItemResponse {
    id : number;
    name : string;
    price : number;
    tax : number;
    weight : number;
    total_capacity : number;
    groups: Group[];
}