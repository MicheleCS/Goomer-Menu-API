import { DayOfWeek } from "../../enums/dayOfWeek";

export interface IPromotion {
    id: string;
    productId: string; 
    description: string;
    promotionalPrice: number; 
    daysOfWeek: DayOfWeek[]; 
    startTime: string; 
    endTime: string; 
    visibility: boolean; 
}