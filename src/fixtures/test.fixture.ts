import { Injectable } from "@nestjs/common";
import AppCategory from "src/config/app/AppCategory";
import { ConfigCategoryService } from "src/config/service/category.service";
import { ConfigLineService } from "src/config/service/line.service";
import { ConfigProgramService } from "src/config/service/program.service";
import AppPermit from "src/permit/module/app.permit";
import { PermitService } from "src/permit/permit.service";
import { UserCreate } from "src/user/guards/user.guard";
import { UserService } from "src/user/user.service";

@Injectable()
export default class TestFixture {

    constructor (
        private permit: PermitService,
        private permitFound: AppPermit,
        private user: UserService,
        private category: ConfigCategoryService,
        private categoryApp: AppCategory,
        private program: ConfigProgramService,
        private line: ConfigLineService,
    ) {

    }

    public async start() {
        // CREACIÓN DE PERMISOS

        const jsonResponse: any[] = [];

        const admin = this.permitFound.GetPermitSuperAdmin();
        const coordinador = this.permitFound.GetPermitCoordinador();
        const student = this.permitFound.GetPermitEstudiante();
        const analista = this.permitFound.GetPermitAnalista();

        const user1: UserCreate = {
            email: `admin@gmail.com`,
            lastname: `Admin`,
            name: `Biblioteca`,
            password: `abc.12345`,
            rolId: ``,
            username: `admin.biblioteca`
        }

        const adminGroupFoundPromise = this.permit.find({ filter:{ name:this.permitFound.SUPER_ADMIN } });
        const coordiandorGroupFoundPromise = this.permit.find({ filter:{ name:this.permitFound.COODINADOR } });
        const estudianteGroupFoundPromise = this.permit.find({ filter:{ name:this.permitFound.ESTUDIANTE } });
        const analistaGroupFoundPromise = this.permit.find({ filter:{ name:this.permitFound.ANALISTA } });
        
        const adminGroupFound =  (await adminGroupFoundPromise).body;
        const coordiandorGroupFound =  (await coordiandorGroupFoundPromise).body;
        const estudianteGroupFound =  (await estudianteGroupFoundPromise).body;
        const analistaGroupFound =  (await analistaGroupFoundPromise).body;

        let adminId = adminGroupFound ? adminGroupFound.id : ``;

        if(adminGroupFound) {
            await this.permit.udpate({ data:{name:this.permitFound.SUPER_ADMIN, group:admin}, id:adminGroupFound.id });
            jsonResponse.push(`${this.permitFound.SUPER_ADMIN} ya creado.`);
        } else {
            const result = await this.permit.create({ data:{ group:admin, name:this.permitFound.SUPER_ADMIN } });
            jsonResponse.push(`${this.permitFound.SUPER_ADMIN}, creado exitosamente`);
            if(result.body) adminId = result.body.id;
        }

        if(coordiandorGroupFound) {
            await this.permit.udpate({ data:{name:this.permitFound.COODINADOR, group:coordinador}, id:coordiandorGroupFound.id });
            jsonResponse.push(`${this.permitFound.COODINADOR} ya creado.`);
        } else {
            await this.permit.create({ data:{ group:coordinador, name:this.permitFound.COODINADOR } });
            jsonResponse.push(`${this.permitFound.COODINADOR}, creado exitosamente`);
        }

        if(estudianteGroupFound) {
            await this.permit.udpate({ data:{name:this.permitFound.ESTUDIANTE, group:student}, id:estudianteGroupFound.id });
            jsonResponse.push(`${this.permitFound.ESTUDIANTE} ya creado.`);
        } else {
            await this.permit.create({ data:{ group:student, name:this.permitFound.ESTUDIANTE } });
            jsonResponse.push(`${this.permitFound.ESTUDIANTE}, creado exitosamente`);
        }

        if(analistaGroupFound) {
            await this.permit.udpate({ data:{name:this.permitFound.ANALISTA, group:analista}, id:analistaGroupFound.id });
            jsonResponse.push(`${this.permitFound.ESTUDIANTE} ya creado.`);
        } else {
            await this.permit.create({ data:{ group:analista, name:this.permitFound.ANALISTA } });
            jsonResponse.push(`${this.permitFound.ESTUDIANTE}, creado exitosamente`);
        }

        let userId = ``;
        const userFoundPromise = this.user.find({ filter:{ email:user1.email } });
        const userFound = (await userFoundPromise).body;
        if(userFound) {
            jsonResponse.push(`${user1.email} ya creado.`);
            userId = userFound.id
        } else {
            const result = await this.user.create({ data:{...user1, rolId:adminGroupFound.id} });
            jsonResponse.push(`${result.body.email} creado exitosamente.`);
            if(result.body) {
                userId = result.body.id;
            }
        }

        const TDPromise = this.category.find({ filter:{ id:this.categoryApp.TD.id } });
        const TEPromise = this.category.find({ filter:{ id:this.categoryApp.TE.id } });
        const TEGPromise = this.category.find({ filter:{ id:this.categoryApp.TEG.id } });

        const TD =  (await TDPromise).body;
        const TE =  (await TEPromise).body;
        const TEG =  (await TEGPromise).body;

        if(TD) {
            jsonResponse.push(`${this.categoryApp.TD.id} ya creado.`);
        } else {
            await this.category.create({ data:{ id:this.categoryApp.TD.id, name:this.categoryApp.TD.name, userId  } });
            jsonResponse.push(`${this.categoryApp.TEG}, creado exitosamente`);
        }

        if(TE) {
            jsonResponse.push(`${this.categoryApp.TE} ya creado.`);
        } else {
            await this.category.create({ data:{ id:this.categoryApp.TE.id, name:this.categoryApp.TE.name, userId } });
            jsonResponse.push(`${this.categoryApp.TE}, creado exitosamente`);
        }

        if(TEG) {
            jsonResponse.push(`${this.categoryApp.TEG} ya creado.`);
        } else {
            await this.category.create({ data:{ id:this.categoryApp.TEG.id, name:this.categoryApp.TEG.name, userId } });
            jsonResponse.push(`${this.categoryApp.TEG}, creado exitosamente`);
        }

        return jsonResponse;

    }

    

}
