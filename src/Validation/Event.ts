export type EventType = 
    | `application`
    | `application.country`
    | `application.state`
    | `application.city`
    | `application.coin`
    | `application.payment`
    | `application.subscription`
    | `application.permit`
    | `application.user`
    | `country`
    | `state`
    | `city`
    | `coin`
    | `payment`
    | `subscription`
    | `permit`
    | `user`
    ;

export type TypeStatictics = `year` | `month`

export interface GenerateStatisticsInterface {
    event:  EventType;
    id?:    string;
    month?: number;
    label?: string[];
    value?: string[];
    year?:  number;
} 

export interface BaseStatictics {
    pie?: true,
    initType: `year` | `month` | ``;
    event: string,
    initId: string,
    initMonth?: number,
    initYear?: number,
    listMonth?: {id:number,label:string}[],
    listYear?:   number[],
    listEvent?:  {objectName:string,label:string}[]
}

export type StaticticsPieName = `user_in_permit` | `coin_in_payment` | `state_in_country` | `city_in_state` | `user_in_subscription` | `user_in_city`;

export interface BaseStaticticsPie {
    name: StaticticsPieName
}
