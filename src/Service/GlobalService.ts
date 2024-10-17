import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { jwtConstants } from "../constant";


@Injectable()
export class GlobalService {

    private salt: number = 10;
    private date = new Date();

    constructor(
        private jwt: JwtService,
    ) {}

    public async Hash({ password }: { password:string }) {
        return await bcrypt.hash(password, this.salt);
    }

    public async Compare({ password,dbPassword}: { password:string, dbPassword:string }) {
        return await bcrypt.compare(password, dbPassword);
    }

    public async GenerateToken({ id }: {id:string}) {
        return (await this.jwt.signAsync({id}, { secret:jwtConstants.secret })); 
    }

    public GetYear() {
        return this.date.getFullYear();
    }

    public GetMonth() {
        return this.date.getMonth()+1;
    }

    public GetDay() {
        return this.date.getDate();
    }

    public GetAllMonth() {
        return [
            `ENERO`,
            `FEBRERO`,
            `MARZO`,
            `ABRIL`,
            `MAYO`,
            `JUNIO`,
            `JULIO`,
            `AGOSTO`,
            `SEPTIEMBRE`,
            `OCTUBRE`,
            `NOVIEMBRE`,
            `DICIEMBRE`
        ]
    }

}
