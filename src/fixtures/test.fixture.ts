import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import AppCategory from "src/config/app/AppCategory";
import { ConfigCategoryService } from "src/config/service/category.service";
import { ConfigLineService } from "src/config/service/line.service";
import { ConfigProgramService } from "src/config/service/program.service";
import AppPermit from "src/permit/module/app.permit";
import { PermitService } from "src/permit/permit.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UserCreate } from "src/user/guards/user.guard";
import { UserService } from "src/user/user.service";
import { TD_PROJECT } from "./TD";
import { TG_PROJECT } from "./TG";
import { TEG_PROJECT, UNIQUE_TEST } from "./TEG";
import ProjectService from "src/project/project.service";

@Injectable()
export default class TestFixture {

    constructor(
        private permit: PermitService,
        private permitFound: AppPermit,
        private user: UserService,
        private category: ConfigCategoryService,
        private categoryApp: AppCategory,
        private program: ConfigProgramService,
        private line: ConfigLineService,
        private prisma: PrismaService,
        private project: ProjectService,
    ) {

    }

    public async start() {
        // CREACIÓN DE PERMISOS

        const jsonResponse: any[] = [];

        const admin = this.permitFound.GetPermitSuperAdmin();
        const coordinador = this.permitFound.GetPermitCoordinador();
        const student = this.permitFound.GetPermitEstudiante();
        const analista = this.permitFound.GetPermitAnalista();
        const obadm = this.permitFound.GetPermitObreroAdmintrativo();
        const docente = this.permitFound.GetPermitObreroAdmintrativo();

        const user1: UserCreate = {
            email: `admin@gmail.com`,
            lastname: `Admin`,
            name: `Biblioteca`,
            password: `abc.12345`,
            rolId: ``,
            username: `admin.biblioteca`
        }

        const adminGroupFoundPromise = this.permit.find({ filter: { name: this.permitFound.SUPER_ADMIN } });
        const coordiandorGroupFoundPromise = this.permit.find({ filter: { name: this.permitFound.COODINADOR } });
        const estudianteGroupFoundPromise = this.permit.find({ filter: { name: this.permitFound.ESTUDIANTE } });
        const analistaGroupFoundPromise = this.permit.find({ filter: { name: this.permitFound.ANALISTA } });
        const obadmGroupFoundPromise = this.permit.find({ filter: { name: this.permitFound.OBRERO_ADMINISTRATIVO } });
        const docenteGroupFoundPromise = this.permit.find({ filter: { name: this.permitFound.DOCENTE } });

        const adminGroupFound = (await adminGroupFoundPromise).body;
        const coordiandorGroupFound = (await coordiandorGroupFoundPromise).body;
        const estudianteGroupFound = (await estudianteGroupFoundPromise).body;
        const analistaGroupFound = (await analistaGroupFoundPromise).body;
        const obadmGroupFound = (await obadmGroupFoundPromise).body;
        const docenteGroupFound = (await docenteGroupFoundPromise).body;

        let adminId = adminGroupFound ? adminGroupFound.id : ``;

        if (adminGroupFound) {
            await this.permit.udpate({ data: { name: this.permitFound.SUPER_ADMIN, group: admin }, id: adminGroupFound.id });
            jsonResponse.push(`${this.permitFound.SUPER_ADMIN} ya creado.`);
        } else {
            const result = await this.permit.create({ data: { group: admin, name: this.permitFound.SUPER_ADMIN } });
            jsonResponse.push(`${this.permitFound.SUPER_ADMIN}, creado exitosamente`);
            if (result.body) adminId = result.body.id;
        }

        if (coordiandorGroupFound) {
            await this.permit.udpate({ data: { name: this.permitFound.COODINADOR, group: coordinador }, id: coordiandorGroupFound.id });
            jsonResponse.push(`${this.permitFound.COODINADOR} ya creado.`);
        } else {
            await this.permit.create({ data: { group: coordinador, name: this.permitFound.COODINADOR } });
            jsonResponse.push(`${this.permitFound.COODINADOR}, creado exitosamente`);
        }

        if (estudianteGroupFound) {
            await this.permit.udpate({ data: { name: this.permitFound.ESTUDIANTE, group: student }, id: estudianteGroupFound.id });
            jsonResponse.push(`${this.permitFound.ESTUDIANTE} ya creado.`);
        } else {
            await this.permit.create({ data: { group: student, name: this.permitFound.ESTUDIANTE } });
            jsonResponse.push(`${this.permitFound.ESTUDIANTE}, creado exitosamente`);
        }

        if (analistaGroupFound) {
            await this.permit.udpate({ data: { name: this.permitFound.ANALISTA, group: analista }, id: analistaGroupFound.id });
            jsonResponse.push(`${this.permitFound.ESTUDIANTE} ya creado.`);
        } else {
            await this.permit.create({ data: { group: analista, name: this.permitFound.ANALISTA } });
            jsonResponse.push(`${this.permitFound.ESTUDIANTE}, creado exitosamente`);
        }

        if (obadmGroupFound) {
            await this.permit.udpate({ data: { name: this.permitFound.OBRERO_ADMINISTRATIVO, group: analista }, id: obadmGroupFound.id });
            jsonResponse.push(`${this.permitFound.OBRERO_ADMINISTRATIVO} ya creado.`);
        } else {
            await this.permit.create({ data: { group: obadm, name: this.permitFound.OBRERO_ADMINISTRATIVO } });
            jsonResponse.push(`${this.permitFound.OBRERO_ADMINISTRATIVO}, creado exitosamente`);
        }

        if (docenteGroupFound) {
            await this.permit.udpate({ data: { name: this.permitFound.DOCENTE, group: docente }, id: docenteGroupFound.id });
            jsonResponse.push(`${this.permitFound.DOCENTE} ya creado.`);
        } else {
            await this.permit.create({ data: { group: docente, name: this.permitFound.DOCENTE } });
            jsonResponse.push(`${this.permitFound.DOCENTE}, creado exitosamente`);
        }

        let userId = ``;
        const userFoundPromise = this.user.find({ filter: { email: user1.email } });
        const userFound = (await userFoundPromise).body;
        if (userFound) {
            jsonResponse.push(`${user1.email} ya creado.`);
            userId = userFound.id
        } else {
            const result = await this.user.create({ data: { ...user1, rolId: adminGroupFound.id } });
            jsonResponse.push(`${result.body.email} creado exitosamente.`);
            if (result.body) {
                userId = result.body.id;
            }
        }

        // this.getLine().forEach(async item => {
        //     const found = await this.line.find({ filter:{name:item.name} });
        //     console.log(item);
        //     if(!found.body) {
        //         const result = await this.line.create({ data:{name:item.name,userId} });
        //         // console.log(result);
        //         jsonResponse.push(`${item.name} Línea de investigación creada`);
        //     }
        // });

        // const TDPromise = this.category.find({ filter:{ id:this.categoryApp.TD.id } });
        // const TEPromise = this.category.find({ filter:{ id:this.categoryApp.TE.id } });
        // const TEGPromise = this.category.find({ filter:{ id:this.categoryApp.TEG.id } });

        // const TD =  (await TDPromise).body;
        // const TE =  (await TEPromise).body;
        // const TEG =  (await TEGPromise).body;

        // if(TD) {
        //     jsonResponse.push(`${this.categoryApp.TD.id} ya creado.`);
        // } else {
        //     await this.category.create({ 
        //         data:{ id:this.categoryApp.TD.id, name:this.categoryApp.TD.name, userId  } });
        //     jsonResponse.push(`${this.categoryApp.TEG}, creado exitosamente`);
        // }

        // if(TE) {
        //     jsonResponse.push(`${this.categoryApp.TE} ya creado.`);
        // } else {
        //     await this.category.create({ data:{ id:this.categoryApp.TE.id, name:this.categoryApp.TE.name, userId } });
        //     jsonResponse.push(`${this.categoryApp.TE}, creado exitosamente`);
        // }

        // if(TEG) {
        //     jsonResponse.push(`${this.categoryApp.TEG} ya creado.`);
        // } else {
        //     await this.category.create({ data:{ id:this.categoryApp.TEG.id, name:this.categoryApp.TEG.name, userId } });
        //     jsonResponse.push(`${this.categoryApp.TEG}, creado exitosamente`);
        // }

        return jsonResponse;
    }

    public async createCategoryProgramsLine() {
        let userId = ``;
        const userFoundPromise = await this.user.find({ filter: { email: `admin@gmail.com` } });

        if (!userFoundPromise.body) return;

        userId = userFoundPromise.body.id;

        this.getLine().forEach(async item => {
            const found = await this.line.find({ filter: { name: item.name } });
            if (!found.body) {
                const result = await this.line.create({ data: { name: item.name.toLocaleUpperCase(), userId } });
                console.log(result);
            }
        });

        const TDPromise = this.prisma.configCategory.create({
            data: {
                id: this.categoryApp.TD.id.toLocaleUpperCase(),
                ident: this.categoryApp.TD.id.toLocaleUpperCase(),
                name: this.categoryApp.TD.name.toLocaleUpperCase(),
                createByRef: { connect: { id: userId } },
            }
        });
        const TEGPromise = this.prisma.configCategory.create({
            data: {
                id: this.categoryApp.TEG.id.toLocaleUpperCase(),
                name: this.categoryApp.TEG.name.toLocaleUpperCase(),
                createByRef: { connect: { id: userId } },
            }
        });
        const TGPromise = this.prisma.configCategory.create({
            data: {
                id: this.categoryApp.TE.id.toLocaleUpperCase(),
                name: this.categoryApp.TE.name.toLocaleUpperCase(),
                createByRef: { connect: { id: userId } },
            }
        });

        const TEG = await TEGPromise;
        const TD = await TDPromise;
        const TG = await TGPromise;

        const LISTTEG = [
            `Especialización en Docencia universitaria`,
            `Especialización en Dermatología`,
            `Especialización en Medicina Familiar`,
            `Especialización en Ecosonografía Diagnostica`,
            `Especialización en Cardiología Infantil`,
            `Especialización en Anesteciología Cardivascular Pediátrica`,
            `Especialización en Ciencias Penales y Criminológicas`,
            `Especialización en Derecho Administrativo`,
            `Especialización en Derecho Laboral`,
            `Especialización en Derecho Procesar Civíl`,
            `Especialización en Derecho Mercantil`,
            `Especialización en Derecho Agrario`,
            `Especialización en Gestión Pública`,
            `Especialización en Medicina Legal`,
            `Especialización en Ciencias Electorales`,
            `Especialización en Gestión de Seguridad Telemática`,
        ]

        const LISTTG = [
            `Maestría Educación Mención Investigación Educativa`,
            `Maestría Educación Mención Enseñanza a la Matemática`,
            `Maestría Educación Mención Desarrollo Comunitario`,
            `Maestría Educación Mención Orientación`,
            `Maestría Gerencia de Salub Pública`,
            `Maestría Enfermería Materno Infantil Obstetricia`,
            `Maestría Enfermería Mención Salub Comunitaria`,
            `Maestría Gerencia Administrativa`,
            `Maestría Desarrollo de Sistema de Producción Animal`,
            `Maestría Gerencia de la Construcción`,
            `Maestría Historia de Venezuela`,
        ]

        LISTTEG.forEach(async (teg) => {
            await this.prisma.configProgram.create({
                data: {
                    categoryId: TEG.id,
                    createById: userId,
                    name: teg.toLocaleUpperCase()
                }
            })
        })

        LISTTG.forEach(async (tg) => {
            await this.prisma.configProgram.create({
                data: {
                    categoryId: TG.id,
                    createById: userId,
                    name: tg.toLocaleUpperCase()
                }
            })
        })

        await this.prisma.configProgram.createMany({
            data: [
                {
                    categoryId: TD.id,
                    createById: userId,
                    name: `Doctorado en Ciencias de la Educación`.toLocaleUpperCase()
                }, {
                    categoryId: TD.id,
                    createById: userId,
                    name: `Doctorado en Ciencias Administrativas`.toLocaleUpperCase()
                }
            ]
        });

        return {
            error: false,
            code: 204,
            message: `Category and programs create success`
        }

    }

    public async createProjectFixtures() {
        // buscar usuarios estudiantes
        const studentsPromise = this.prisma.user.findMany({ where: { rolReference: { name: this.permitFound.ESTUDIANTE } } });

        // buscar archivo
        const filePromise = this.prisma.configDocument.findFirst();

        const student = await studentsPromise;
        const file = await filePromise;


        if (!student) return { message: `user not found` };
        if (!file) return { message: `document not found` };

        // crear projectos de TD
        // await this.project.customCreate({
        //     data: {
        //         date: TD_PROJECT[0].date,
        //         keywords: TD_PROJECT[0].keywords,
        //         resumen: TD_PROJECT[0].resumen,
        //         title: TD_PROJECT[0].title,
        //         authos: {
        //             create: {
        //                 createByRef: { connect: { id: student[Math.floor(Math.random() * student.length)].id } }
        //             }
        //         },
        //         programRef: { connect: { id: `1e3a70b8-8b2a-4cc9-ad4a-591ccef1358e` } },
        //         documentRef: { create: {mimyType:file.mimyType,originalName:file.originalName,path:file.path,size:file.size,donwload:file.donwload,createByRef:{connect:{id:student[Math.floor(Math.random() * student.length)].id}}} },
        //         public: true,
        //         downloader: true,
        //         status: `APROADO`,
        //     },
        //     date: TD_PROJECT[0].dateText,
        //     id: `1e3a70b8-8b2a-4cc9-ad4a-591ccef1358e`
        // })
        await this.project.customCreate({
            data: {
                date: TD_PROJECT[1].date,
                keywords: TD_PROJECT[1].keywords,
                resumen: TD_PROJECT[1].resumen,
                title: TD_PROJECT[1].title,
                authos: {
                    create: {
                        createByRef: { connect: { id: student[Math.floor(Math.random() * student.length)].id } }
                    }
                },
                programRef: {
                    connect: { id: `1e5e9b6de1-59f9-4156-aaeb-f3eb72c64802` }
                },
                documentRef: { create: {mimyType:file.mimyType,originalName:file.originalName,path:file.path,size:file.size,donwload:file.donwload,createByRef:{connect:{id:student[Math.floor(Math.random() * student.length)].id}}} },
            },
            date: TD_PROJECT[1].dateText,
            id: `1e5e9b6de1-59f9-4156-aaeb-f3eb72c64802`
        })

        // crear projecto de TG
        TG_PROJECT.forEach(async (item) => {
            await this.project.customCreate({
                data: {
                    date: item.date,
                    keywords: item.keywords,
                    resumen: item.resumen,
                    title: item.title,
                    authos: { create: { createByRef: { connect: { id: student[Math.floor(Math.random() * student.length)].id } } }},
                    programRef: { connect: { id: item.id } },
                    documentRef: { create: {mimyType:file.mimyType,originalName:file.originalName,path:file.path,size:file.size,donwload:file.donwload,createByRef:{connect:{id:student[Math.floor(Math.random() * student.length)].id}}} },
                },
                date: item.dateText,
                id: item.id
            })
        })

        TEG_PROJECT.forEach(async (item) => {
            await this.project.customCreate({
                data: {
                    date: item.date,
                    keywords: item.keyword,
                    resumen: item.resumen,
                    title: item.title,
                    authos: { create: { createByRef: { connect: { id: student[Math.floor(Math.random() * student.length)].id } } }},
                    programRef: { connect: { id: item.id } },
                    documentRef: { create: {mimyType:file.mimyType,originalName:file.originalName,path:file.path,size:file.size,donwload:file.donwload,createByRef:{connect:{id:student[Math.floor(Math.random() * student.length)].id}}} },
                },
                date: item.dateText,
                id: item.id
            })
        })

        await this.project.customCreate({
            data: {
                date: UNIQUE_TEST.date,
                keywords: UNIQUE_TEST.keyword,
                resumen: UNIQUE_TEST.resumen,
                title: UNIQUE_TEST.title,
                authos: {
                    createMany: {
                        data: [
                            {createById: student[Math.floor(Math.random() * student.length)].id},
                            {createById: student[Math.floor(Math.random() * student.length)].id},
                        ]
                    }
                },
                programRef: { connect: { id: UNIQUE_TEST.id } },
                documentRef: { create: {mimyType:file.mimyType,originalName:file.originalName,path:file.path,size:file.size,donwload:file.donwload,createByRef:{connect:{id:student[Math.floor(Math.random() * student.length)].id}}} },
            },
            date: UNIQUE_TEST.dateText,
            id: UNIQUE_TEST.id
        });

    }

    public async createStudent() {
        const hashPromise = this.user.hashPassword({ password: `abc.12345` });

        function generarNombre() {
            const nombres = ['Juan', 'Pedro', 'Maria', 'Jose', 'Ana', 'Sofia', 'Juan Carlos', 'Maria Jose', 'Juan Sebastian', 'Sofia Isabel'];
            return nombres[Math.floor(Math.random() * nombres.length)];
        }

        function generarApellido() {
            const apellidos = ['Gonzalez', 'Ramirez', 'Martinez', 'Gomez', 'Diaz', 'Hernandez', 'Lopez', 'Rodriguez', 'Jimenez', 'Martinez'];
            return apellidos[Math.floor(Math.random() * apellidos.length)];
        }

        function generarUsuario() {
            const usuarios = ['juan123', 'pedro456', 'maria789', 'jose012', 'ana345', 'sofia678', 'juanCarlos901', 'mariaJose234', 'juanSebastian567', 'sofiaIsabel890'];
            return usuarios[Math.floor(Math.random() * usuarios.length)];
        }

        function generarCorreo() {
            return `${generarNombre()}${generarApellido()}@example.com`;
        }

        function generarCedula() {
            const num = Math.floor(Math.random() * 10000000001);
            return num.toString().padStart(8, '0');
        }

        const arr = Array(30).fill(0).map(() => {
            return {
                nombre: generarNombre(),
                apellido: generarApellido(),
                usuario: generarUsuario(),
                correo: generarCorreo(),
                cedula: generarCedula()
            };
        });

        const hash = await hashPromise;

        arr.forEach(async (item) => {
            const result = await this.user.create({
                data: {
                    email: item.correo,
                    lastname: item.apellido,
                    name: item.nombre,
                    password: `abc.12345`,
                    rolId: `f0947fa0-76d4-4337-ace5-b2d6308bf5de`,
                    username: item.usuario,
                    ci: item.cedula,
                }
            });
            // console.log(`Creado: ${result}`);
        })
        // arr.forEach(async (item) => {
        //     await this.prisma.user.create({
        //         data: {
        //             email: item.correo,
        //             password: hash,
        //             username: item.usuario,
        //             name: item.nombre,
        //             lastname: item.apellido,
        //             ci: item.cedula,
        //             rolReference: { connect: { id: this.permitFound.ESTUDIANTE } }
        //         }
        //     })
        // });
    }

    private getPrograms() {
        return [
            "Medicina",
            "Ingeniería Civil",
            "Enfermería",
            "PNF Ingeniería Industrial",
            "Odontología",
            "Ingeniería de Sistemas",
            "Radiodiagnóstico",
            "PNF Ingeniería Electrónica",
            "PNF Radioimagen",
            "Especialización en Incidencias Telemáticas",
            "PNF Histocitotecnología",
            "Maestría en Gestión de la Construcción",
            "PNF Fisioterapia",
            "Education Sciences",
            "PNF Terapia ocupacional",
            "Educación (Informática)",
            "PNF Nutrición y dietética",
            "Educación (Integral)",
            "PNF Optometría",
            "Especialización en Educación Universitaria",
            "Especialización en Dermatología",
            "Maestría en Educación en Desarrollo Comunitario",
            "Especialización en Medicina de Familia",
            "Maestría en Educación en Enseñanza de las Matemáticas",
            "Especialización en Cardiología Pediátrica",
            "Maestría en Investigación Educativa",
            "Especialidad Ecografía Diagnóstica",
            "Maestría en Educación, Orientación",
            "Especialización en Anestesia Cardiológica Pediátrica",
            "Maestría en Educación, Desarrollo Comunitario",
            "Maestría en Enfermería, Mención Salud Comunitaria",
            "Doctorado en Ciencias de la Educación",
            "Maestría en Gestión de la Salud Pública",
            "Ciencias Económicas y Sociales",
            "Ciencias Agronómicas",
            "Administración Comercial",
            "Agronomía (Producción Animal)",
            "Contaduría Pública",
            "Agronomía (Producción Vegetal)",
            "Economía",
            "Medicina Veterinaria",
            "Especialización en Derecho y Desarrollo Agrario Integral",
            "Especialización en Gestión Pública",
            "Master en Derecho Agrario",
            "Especialización en Ciencias Penales y Criminología",
            "Especialización en Derecho Procesal Penal",
            "Maestría en Gestión de la Comunicación",
            "Maestría en Gestión Administrativa",
            "Maestría en Historia de Venezuela",
            "Doctorado en ciencias administrativas",
            "Ciencias Políticas y Jurídicas",
            "Especialización en Derecho Laboral",
            "Especialización en Derecho Administrativo",
            "Especialización en Ciencias Electorales"
        ];
    }

    private getLine() {
        return [
            {
                name: "Cultura, Identidad e Independencia",
                description: "Vinculada a los rasgos distintivos de las sociedades, códigos y patrones de los mundos socioculturales, formas o maneras de vida que fundamentan la independencia plena y el desarrollo humano y social (integral: bio-psico-ético-estético-social)."
            },
            {
                name: "Bienestar, Ambiente y Sostenibilidad",
                description: "Relacionado al fomento del equilibrio físico, mental y emocional del ser humano como a la preservación, saneamiento y prevención ambiental para su desarrollo humano y social desde una perspectiva sostenible (para generaciones futuras)."
            },
            {
                name: "Estado, Sociedad y Desarrollo",
                description: "Vinculado al abordaje de la infraestructura político-socio-económica y cultural que gestiona el Estado en función del desarrollo nacional y su proyección internacional desde una perspectiva sostenible."
            },
            {
                name: "Geopolítica y Glocalización",
                description: "Integra el estudio de los intereses geopolíticos definidos en torno a la capacidad de producción tecnológica, de conocimiento, el capital humano, el potencial de recursos naturales integrando así escenarios tangibles como los geográficos, e intangibles, como los culturales; lo anterior desde una perspectiva global-glocal, o viceversa, en que la ubicación local del sujeto-objeto de estudio es codependiente del contexto global (glocalización)."
            },
            {
                name: "Gestión de Instituciones Sólidas, Efectivas y Transparentes",
                description: "Sintetiza el manejo y conducción efectiva de organizaciones viables y saludables en entornos altamente complejos; integra la gestión de procesos, talentos y recursos materiales, tecnológicos y financieros."
            },
            {
                name: "Ciencia, Tecnología e Innovación",
                description: "Estudios vinculados a las ciencias básicas y aplicadas, los avances tecnológicos e innovaciones que faciliten el diseño e implementación de medidas que viabilicen la optimización y mejora de procesos de gestión del conocimiento, de producción y manufactura en materia vial, eléctrica y hídrica."
            }
        ];
    }

}
