import { Prisma } from "@prisma/client";

export interface CreateCityType {
    stateId:                string;
    name:                   string;
} 

export interface UpdateCityType {
    name:                   string;
}
