import { Injectable } from '@nestjs/common';
import { LanguajeInterface } from './guard/languaje.interface';

@Injectable()
export class LanguajeService {

    public GetPayload() {}

    public GetAllPayloads() {}

    public GetTranslate(): LanguajeInterface {

        return {
            ACTIONS: {
                DANGER: {
                    CREATE: `Error al crear.`,
                    DELETE: `Error al eliminar.`,
                    LIST: `Error al consultar.`,
                    RECOVERY: `Error al recuperar.`,
                    SHOW: `Error al buscar.`,
                    UPDATE: `Error al actualizar.`,
                    LOGIN: `Error al iniciar sesión.`,
                    REGISTER: `Error al crear una cuenta.`,

                    VALIDATIONS: {
                        EMAIL_IN_USE: `Error, correo en uso.`,
                        PASSWORD_FREE: `Error, contraseña muy débil.`,
                        USERNAME_IN_USE: `Error, usuario en uso`
                    }
                },
                SUCCESS: {
                    CREATE: `Creación exitosa.`,
                    DELETE: `Eliminación exitosa.`,
                    LIST: `Consulta exitosa.`,
                    RECOVERY: `Recuperación exitosa.`,
                    SHOW: `Busqueda exitosa.`,
                    UPDATE: `Actualización exitosa.`,
                    LOGIN: `Inicio de sesión exitoso.`,
                    REGISTER: `Registro exitoso`
                },
                NOT_FOUND: `No encontrado.`,
                NOT_PERMIT: `No permitido.`,
                NOT_VALID: `No valid.`,
            },
            EVENTS: {},
            HISTORY: {},
            TITLES: {
                DOWNLOAD: `Descargar`,
                INPUT: {
                    MUNICIPIO: `Municipio`,
                    PARROQUIA: `Parroquia`,
                    STATE: `Estado`,
                    CI: `Cédula`,
                    PERMIT: `Permisos`,
                    PASSWORD: `Contraseña`,
                    USERNAME: `Usuario`,
                    CATEGORY: `Categoría`,
                    ID: `Identificador`,
                    DESCRIPTION: `Descripción`,
                    EMAIL: `Correo electrónico`,
                    LASTNAME: `Apellido`,
                    NAME: `Nombre`
                },

                CREATE: `Crear`,
                DELETE: `Eliminar`,
                LIST: `Lista`,
                RECOERY: `Recuperar`,
                REPORT: `Reporte`,
                UNIQUE: `Ver`,
                UPDATE: `Actualizar`,
        
                NAV: {
                    LOGOUT: `salir`,
                    PROFILE: `perfil`,
                },
                SLIDE: {
                    PERMIT: `Permisos`,
                    ANALYSIS: `Análisis`,
                    CONFIG: {
                        INDEX: `Configuraciones`,
                        CATEGORY: `Categoria`,
                        LINE: `Líneas de investigación`,
                        PROGRAM: `Programas`
                    },
                    REGIONAL: {
                        INDEX: `Regional`,
                        MUNICIPIO: `Municipios`,
                        NUCLEO: `Nucleos`,
                        PARROQUIA: `Parroquias`,
                        STATE: `Estados`,
                    },
                    DASHBOARD: `Panel de control`,
                    PROJECTS: `Proyectos`,
                    REPORT: `Reportes`,
                    USERS: `Usuarios`
                }
            },
            REPORTS: {
                MUNICIPIO: {
                    many: `Municipios`,
                    project: `Municipios`,
                    unique: `Municipio único`,
                },
                NUCLEO: {
                    many: `Nucleos`,
                    project: `Nucleos`,
                    unique: `Nucleo único`,
                },
                PARROQUIA: {
                    many: `Parroquias`,
                    project: `Parroquias`,
                    unique: `Parroquia único`,
                },
                STATE: {
                    many: `Estados`,
                    project: `Estados`,
                    unique: `Estado único`,
                },
                PROJECT: {
                    many: `Proyectos`,
                    project: `Proyectos`,
                    unique: `Proyecto único`,
                },
                CATEGORY: {
                    many: `Categorías`,
                    project: `Categorías en proyectos`,
                    unique: `Cateoría única`,
                },
                LINE: {
                    many: `Líneas de investigación`,
                    project: `Líneas de investigación en proyectos`,
                    unique: `Línea de investigación única`,
                },
                PROGRAM: {
                    many: `Programas`,
                    project: `Programas en proyectos`,
                    unique: `Programa única`,
                },
                USER: {
                    many: `Usuarios`,
                    project: `Usuarios en proyectos`,
                    unique: `Usuario única`,
                }
            }
        }
    }

}
