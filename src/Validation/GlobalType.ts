import { User } from "@prisma/client";
import { Request } from "express";

export interface ReponseServiceDto {
    error: boolean,
    message: string,
    body: any
}

export interface SuccessResponseServiceLogin {

}

export interface RequetsUser extends Request {
    user: User
}
