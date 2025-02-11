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
                        USERNAME_IN_USE: `Error, usuario en uso.`,
                        CI_IN_USE: `Error, cédula en uso.`,

                        NAME_IN_USE: `Nombre en uso`,

                        SUMARY_IN_USE: `Resumen en uso.`,
                        SUMARY_LONG_TEXT: `Resumen debe ser de 150 caracteres`,
                        TITLE_IN_USE: `Título en uso.`,
                        
                        FIELDS_REQUIERED: {
                            author: `Debes agregar al menos un autor.`,
                            category: `Campo "Categoría" es requerido.`,
                            ci: `Campo "Cédula" es requerido.`,
                            date: `Campo "Fecha" es requerido.`,
                            email: `Campo "Correo" es requerido.`,
                            file: `Debes agregar un archivo.`,
                            id: `Campo "Identificador" es requerido.`,
                            keywords: `Campo "Palabras clave" es requerido.`,
                            lastname: `Campo "Apellido" es requerido.`,
                            municipio: `Campo "Municipio" es requerido.`,
                            name: `Campo "Nombre" es requerido.`,
                            parroquia: `Campo "Parroquia" es requerido.`,
                            password: `Campo "Contraseña" es requerido.`,
                            program: `Campo "Programa" es requerido.`,
                            rol: `Campo "Rol" es requerido.`,
                            state: `Campo "Estado" es requerido.`,
                            sumary: `Campo "Resumen" es requerido.`,
                            title: `Campo "Título" es requerido.`,
                            username: `Campo "Usuario" es requerido.`,

                            education: {
                                course: {
                                    area: `Campo "Área" es requerido.`,
                                    country: `Campo "País" es requerido.`,
                                    description: `Campo "Descripción" es requerido.`,
                                    hours: `Campo "Horas" es requerido.`,
                                    institucion: `Campo "Institución" es requerido.`,
                                    subarea: `Campo "Subarea" es requerido.`,
                                    tipe: `Campo "Tipo" es requerido.`,
                                },
                                title: {
                                    area: `Campo "Área" es requerido.`,
                                    country: `Campo "País" es requerido.`,
                                    institucion: `Campo "Institución" es requerido.`,
                                    nivel: `Campo "Nivel" es requerido.`,
                                    profesion: `Campo "Profesión" es requerido.`,
                                    subarea: `Campo "Subarea" es requerido.`,
                                    yearEnd: `Campo "Año Finalización" es requerido.`,
                                }
                            },
                            work: {
                                cargo: `Campo "Cargo" es requerido.`,
                                dateEnd: `Campo "Fecha Fin" es requerido.`,
                                dateStart: `Campo "Fecha Inicio" es requerido.`,
                                institucion: `Campo "Institución" es requerido.`,
                                ocupacion: `Campo "Ocupación" es requerido.`,
                                type: `Campo "Tipo Institución" es requerido.`,

                                dateEndNotNow: `Si es tu trabajo actual no agregues fecha de finalización`,
                                IsNotNowRequeredDateEnd: `Debes agregar fecha de finalización.`
                            }
                        }
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
                    MATRIZ: `Matriz`,
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
