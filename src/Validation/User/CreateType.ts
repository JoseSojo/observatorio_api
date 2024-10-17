import { Prisma } from "@prisma/client";

export interface CreateUserType {
    email:              string;
    password:           string;
    username:           string;
    cityId?:            string;
    name?:              string;
    lastname?:          string;
    roleId?:            string;
} 

export interface UpdateUserType {
    email:              string;
    password:           string;
    username:           string;
    cityId:             string;
    name:               string;
    lastname:           string;
}
