import { Prisma } from "@prisma/client";

export interface CreatePermitType {
    name:                   string;
    permits:                string[];
    userId:                 string;

} 

export interface UpdatePermitType {
    name:                   string;
    roles:                  string[]
}
