import { Prisma } from "@prisma/client";

export interface CreatePaymentMethodType {
    name:                   string;
    description:            string;
    coinId:                 string;
} 

export interface UpdatePaymentMethodType {
    name:                   string;
}
