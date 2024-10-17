import { Prisma } from "@prisma/client";

export interface CreateLanguajeType {
    label:                      string;
    payload:                    string;
} 

export interface UpdateLanguajeType {
    label:                      string;
    payload:                    string;
}
