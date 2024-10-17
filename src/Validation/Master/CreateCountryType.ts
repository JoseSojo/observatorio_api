import { Prisma } from "@prisma/client";

export interface CreateCountryType {
    name:                   string;
    prefixPhone:            string;
    coinId:                 string;
} 

export interface UpdateCountryType {
    name:                   string;
}
