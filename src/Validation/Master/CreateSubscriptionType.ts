import { Prisma } from "@prisma/client";

export interface CreateSubscriptionType {
    name:                   string;
    countMonth:             number;
    discount:               number;
} 

export interface UpdateSubscriptionType {
    name:                   string;
    countMonth:             number;
    discount:               number
}
