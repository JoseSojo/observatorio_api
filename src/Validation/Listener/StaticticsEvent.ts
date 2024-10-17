export interface ForMonthCreate { event:string, name:string,index:number,year:number,day:number,monthName:string,id:string }
export interface ForMonthUpdate { id:string,day:number }
export interface ForMonthFound { name:string,year?:number,month?:number,id?:string }
export interface ForMonthEvent { id?:string, event:string }

export interface ForYearCreate { event:string,name:string,index?:string,year:number,month:number,id:string }
export interface ForYearUpdate { id:string,month:number }
export interface ForYearFound { name:string,year?:number,id?:string, month?:number }
export interface ForYearEvent { event:string,id?:string }
