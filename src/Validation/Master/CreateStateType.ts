import { Prisma } from "@prisma/client";

export interface CreateStateType {
    name:              string;
    countryId:          string;
} 

export interface UpdateStateType {
    name?:              string;
}
