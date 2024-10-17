import { Prisma } from "@prisma/client";

export interface CreateCoinType {
    name:              string;
    description:           string;
    prefix:           string;
} 

export interface UpdateCoinType {
    name?:              string;
    description?:           string;
    prefix?:           string;
}
