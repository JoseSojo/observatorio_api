import { Injectable } from "@nestjs/common";

@Injectable()
export default class AppEvent {

    /**
     * FOR STATICTICS
     */
    public readonly STATICTICS_CREATE_USER =               `STATICTICS_CREATE_USER`;
    public readonly STATICTICS_CREATE_USER_STUDENT =       `STATICTICS_CREATE_USER_STUDENT`;
    public readonly STATICTICS_CREATE_USER_DOCENTE =       `STATICTICS_CREATE_USER_DOCENTE`;
    public readonly STATICTICS_CREATE_USER_COORDINADOR =   `STATICTICS_CREATE_USER_COORDINADOR`;
    public readonly STATICTICS_CREATE_USER_OBRERO_ADMIN =  `STATICTICS_CREATE_USER_OBRERO_ADMIN`;
    public readonly STATICTICS_CREATE_PROJECT =            `STATICTICS_CREATE_PROJECT`;

    private readonly STATICTICS_USER = `STATICTICS_USER`;
    private readonly STATICTICS_USER_STUDENT = `STATICTICS_USER_STUDENT`;
    private readonly STATICTICS_USER_OBRERO_ADMINISTRATIVO = `STATICTICS_USER_OBRERO_ADMINISTRATIVO`;
    private readonly STATICTICS_INFORMATION_EDUCATIVE = `STATICTICS_INFORMATION_EDUCATIVE`;
    private readonly STATICTICS_INFORMATION_LABORAL = `STATICTICS_INFORMATION_LABORAL`;
    private readonly STATICTICS_PROJECT = `STATICTICS_PROJECT`;
    private readonly STATICTICS_PROJECT_DOCTORADO = `STATICTICS_PROJECT_DOCTORADO`;
    private readonly STATICTICS_PROJECT_ESPECIAL_GRADO = `STATICTICS_PROJECT_ESPECIAL_GRADO`;
    private readonly STATICTICS_PROJECT_DE_GRADO = `STATICTICS_PROJECT_DE_GRADO`;
    private readonly STATICTICS_PROJECT_PRE_GRADO = `STATICTICS_PROJECT_PRE_GRADO`;

    // STATICTICS
    public getAllEvents () {
        return {
            user: {
                user: {
                    label: `Registros de todos los usuarios`,
                    key: this.STATICTICS_USER
                },
                student: {
                    label: `Registros de todos los estudiantes`,
                    key: this.STATICTICS_USER_STUDENT
                },
                obreroadmin: {
                    label: `Registros de todos los obreros/administrativos`,
                    key: this.STATICTICS_USER_OBRERO_ADMINISTRATIVO
                },
            },
            information: {
                user: {
                    label: `Registro información educativa`,
                    key: this.STATICTICS_INFORMATION_EDUCATIVE
                },
                student: {
                    label: `Registros registro de información laboral`,
                    key: this.STATICTICS_INFORMATION_LABORAL
                },
            },
            project: {
                project: {
                    label: `Registros de todos los proyectos`,
                    key: this.STATICTICS_PROJECT
                },
                doctorado: {
                    label: `Registros de Tesis Doctoral`,
                    key: this.STATICTICS_PROJECT_DOCTORADO
                },
                especialGrado: {
                    label: `Registros de Trabajos Especiales de Grado`,
                    key: this.STATICTICS_PROJECT_ESPECIAL_GRADO
                },
                deGrado: {
                    label: `Registros de Trabajos de Grado`,
                    key: this.STATICTICS_PROJECT_DE_GRADO
                },
                preGrado: {
                    label: `Registros de Trabajos Pre Grado`,
                    key: this.STATICTICS_PROJECT_PRE_GRADO
                }
            }
        }
    }

    // 
    public readonly EVENT_CATEGORY_CREATE = `EVENT_CATEGORY_CREATE`;  
    public readonly EVENT_CATEGORY_UPDATE = `EVENT_CATEGORY_UPDATE`;  
    public readonly EVENT_CATEGORY_DELETE = `EVENT_CATEGORY_DELETE`;  
    public readonly EVENT_CATEGORY_RECOVERY = `EVENT_CATEGORY_RECOVERY`;  

    public readonly EVENT_PROGRAM_CREATE = `EVENT_PROGRAM_CREATE`;  
    public readonly EVENT_PROGRAM_UPDATE = `EVENT_PROGRAM_UPDATE`;  
    public readonly EVENT_PROGRAM_DELETE = `EVENT_PROGRAM_DELETE`;  
    public readonly EVENT_PROGRAM_RECOVERY = `EVENT_PROGRAM_RECOVERY`;  

    public readonly EVENT_LINE_CREATE = `EVENT_LINE_CREATE`;  
    public readonly EVENT_LINE_UPDATE = `EVENT_LINE_UPDATE`;  
    public readonly EVENT_LINE_DELETE = `EVENT_LINE_DELETE`;  
    public readonly EVENT_LINE_RECOVERY = `EVENT_LINE_RECOVERY`;  

    public readonly EVENT_USER_CREATE = `EVENT_USER_CREATE`;  
    public readonly EVENT_USER_UPDATE = `EVENT_USER_UPDATE`;  
    public readonly EVENT_USER_DELETE = `EVENT_USER_DELETE`;  
    public readonly EVENT_USER_RECOVERY = `EVENT_USER_RECOVERY`;  

    public readonly EVENT_PROJECT_CREATE        = `EVENT_PROJECT_CREATE`;  
    public readonly EVENT_PROJECT_UPDATE        = `EVENT_PROJECT_UPDATE`;  
    public readonly EVENT_PROJECT_SET_PUBLIC    = `EVENT_PROJECT_SET_PUBLIC`;
    public readonly EVENT_PROJECT_SET_DOWNLOAD  = `EVENT_PROJECT_SET_DOWNLOAD`;
    public readonly EVENT_PROJECT_DELETE        = `EVENT_PROJECT_DELETE`;  
    public readonly EVENT_PROJECT_RECOVERY      = `EVENT_PROJECT_RECOVERY`; 
    
    public readonly EVENT_REGIONAL_STATE_CREATE = `EVENT_REGIONAL_STATE_CREATE`;  
    public readonly EVENT_REGIONAL_STATE_UPDATE = `EVENT_REGIONAL_STATE_UPDATE`;  
    public readonly EVENT_REGIONAL_STATE_DELETE = `EVENT_REGIONAL_STATE_DELETE`;  
    public readonly EVENT_REGIONAL_STATE_RECOVERY = `EVENT_REGIONAL_STATE_RECOVERY`;  

    public readonly EVENT_REGIONAL_MUNICIPIO_CREATE = `EVENT_REGIONAL_MUNICIPIO_CREATE`;  
    public readonly EVENT_REGIONAL_MUNICIPIO_UPDATE = `EVENT_REGIONAL_MUNICIPIO_UPDATE`;  
    public readonly EVENT_REGIONAL_MUNICIPIO_DELETE = `EVENT_REGIONAL_MUNICIPIO_DELETE`;  
    public readonly EVENT_REGIONAL_MUNICIPIO_RECOVERY = `EVENT_REGIONAL_MUNICIPIO_RECOVERY`;  

    public readonly EVENT_REGIONAL_PARROQUIA_CREATE = `EVENT_REGIONAL_PARROQUIA_CREATE`;  
    public readonly EVENT_REGIONAL_PARROQUIA_UPDATE = `EVENT_REGIONAL_PARROQUIA_UPDATE`;  
    public readonly EVENT_REGIONAL_PARROQUIA_DELETE = `EVENT_REGIONAL_PARROQUIA_DELETE`;  
    public readonly EVENT_REGIONAL_PARROQUIA_RECOVERY = `EVENT_REGIONAL_PARROQUIA_RECOVERY`;  

    public readonly EVENT_REGIONAL_NUCLEO_CREATE = `EVENT_REGIONAL_NUCLEO_CREATE`;  
    public readonly EVENT_REGIONAL_NUCLEO_UPDATE = `EVENT_REGIONAL_NUCLEO_UPDATE`;  
    public readonly EVENT_REGIONAL_NUCLEO_DELETE = `EVENT_REGIONAL_NUCLEO_DELETE`;  
    public readonly EVENT_REGIONAL_NUCLEO_RECOVERY = `EVENT_REGIONAL_NUCLEO_RECOVERY`;  

}
