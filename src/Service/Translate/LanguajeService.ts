import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/Model/M/User/UserModel';
import { TranslateType } from 'src/Validation/Translate';

@Injectable()
export class LanguajeService {

    constructor() {}

    private GetPayload() {
        return `ES`;
    }

    public GetTranslate(): TranslateType {
        const pay = this.GetPayload();

        if(pay === `ES`) {
            return this.ES();
        }

        return this.DEFAUTL();
    }

    private ES(): TranslateType {
        return {
            Action: {
                CREATE: `Creado exitosamente.`,
                UDPATE: `Actualizado exitosamente.`,
                DELETE: `Eliminado exitosamente.`,
                RECOVERY: `Restaurado exitosamente.`,
                GETTING: `Obtenido exitosamente.`,
                FIND: `Busqueda exitosa.`,
                NOT_FOUND: `No encontrado.`,
                NOT_PERMIT: `No tienes acceso.`,
                NOT_RESULT: `No hay resultados.`,
                NOT_VALID: `No valido.`,
                NOW_EXIST: `Ya existe ese registro.`,
                PASSWORD_NOT_MATCH: `Contraseñas no coincoinden.`,
                PASSWORD_NOT_VALID: `Contraseña no válida.`,
                PASSWORD_REQUETS: `Solicited de recuperación de contraseña`,
                PASSWORD_CHANGE: `Actualización de contraseña`,
            },
            Auth: {
                ACCESS: `Datos incorrectos.`,
                ACCESS_EMAIL: `Correo incorrecto.`,
                ACCESS_PASSWORD: `Contraseña no coincide.`,
                SUCCESS: `Datos correctos.`,
            },
            User: {
                USERNAME_FOUND:`Nombre de usuario en uso.`,
                EMAIL_FOUND:`Correo en uso.`,
                EMAIL_NOT_FOUND:`Correo no valido.`,
                USERNAME_NOT_FOUND:`Nombre de usuario no valido.`
            },
            Required: {
                FREE_MONTH: `Campo "Meses gratis" no válido.`,
                PERCENJATE: `Campo "Porcentaje" no válido.`,
                CITY: `Campo "Ciudad" no válido.`,
                COIN: `Campo "Moneda" no válido.`,
                COUNTRY: `Campo "País" no válido.`,
                EMAIL: `Campo "Correo" no válido.`,
                NAME: `Campo "Nombre" no válido.`,
                PREFIX: `Campo "Prefijo" no válido.`,
                STATE: `Campo "Estado" no válido.`,
                USERNAME: `Campo "Usuario" no válido.`,
                LASTNAME: `Campo "Apellido" no válido.`,
                PASSWORD: `Campo "Contraseña" no válido.`,
                REPEAT_PASSWORD: `Campo "Repetir contraseña" no válido.`,
                DESCRIPTION: `Campo "Descripción" no válido`
            },
            Slide: {
                user: `Ususario`,
                master: `Maestros`,
                city: `Ciudad`,
                country: `País`,
                subscription: `Suscripciones`,
                coin: `Moneda`,
                payment: `Pagos`,
                permit: `Permisos`,
                state: `Estados`
            },
            Input: {
                dpercentaje_discount: `Porcentaje de descuento`,
                free_month: `Meses gratis`,
                name: `Nombre.`,
                lastname: `Apellido.`,
                username: `Usuario.`,
                email: `Correo Electrónico.`,
                password: `Contraseña.`,
                city: `Ciudad.`,
                conuntry: `País.`,
                permit: `Permiso.`,
                nowPassword: `Contraseña actual.`,
                newPassword: `Contraseña nueva.`,
                repeatPassword: `Repetir contraseña.`,
                description: `Descripción`,
                prefix: `Prefijo`,
                prefixPhone: `Código de teléfono`,
                coin: `Moneda`,
                state: `Estado`
            },
            Placeholder: {
                name: `Nombre.`,
                lastname: `Apellido.`,
                username: `Usuario.`,
                email: `Correo Electrónico.`,
                city: `Ciudad.`,
                conuntry: `País.`,
                permit: `Permiso.`,
            },
            Titles: {
                Statictics: {
                    pie: {
                        "city.state": `Ciudades con estados.`,
                        "coin.payment": `Monedas en métodos de pago.`,
                        "country.state": `Estados en países.`,
                        "role.user": `Permisos en usuarios.`,
                        "subscription.user": `Subscripciones en usuarios.`,
                    },
                    graphics: {}
                },
                Sections: {
                    history: `Historial`
                },
                Form: {
                    profile: {
                        data: `Actualizar datos`,
                        password: `Actualizar Contraseña`,
                        photo: `Actualizar Foto de perfil`,
                    },
                    create: `Crear`,
                    update: `Actualizar`,
                    delete: `Eliminar`
                },
                Crud: {
                    city: `Ciudad`,
                    coin: `Moneda`,
                    conuntry: `País`,
                    payment: `Métodos de pago`,
                    state: `Estado`,
                    subscription: `Subscripción`,
                    permit: `Permisos`,
                    user: `Usuarios`
                }
            },
            Permit: {
                create: `Crear `,
                delete: `Eliminar `,
                list: `Lista `,
                restore: `Restaurar `,
                unique: `Ver `,
                update: `Actualizar `,
                profile: {
                    notifications: `Notificationes.`,
                    password: `Actualizar contraseña.`,
                    update: `Actualizar perfil.`,
                    photo: `Actualizar foto.`,
                    profile: `Ver perfil`,
                    statictics_month: `Mís estadisticas por mes.`,
                    statictics_year: `Mís estadisticas por año.`,
                },
                statictics: {
                    month: `Estadisticas por mes.`,
                    year: `Estadisticas por año.`
                }
            },
            Notification: {
                create: {
                    city: `Creaste ciudad.`,
                    coin: `Creaste moneda.`,
                    country: `Creaste país.`,
                    payment: `Creaste método de pago.`,
                    permit: `Creaste permiso.`,
                    subscription: `Creaste subscripción.`,
                    state: `Creaste estado.`,
                },
                delete: {
                    city: `Delete ciudad.`,
                    coin: `Delete moneda.`,
                    country: `Delete país.`,
                    payment: `Delete método de pago.`,
                    permit: `Delete permiso.`,
                    subscription: `Delete subscripción.`,
                    state: `Delete estado.`,
                },
                recovery: {
                    city: `Recuperaste ciudad.`,
                    coin: `Recuperaste moneda.`,
                    country: `Recuperaste país.`,
                    payment: `Recuperaste método de pago.`,
                    permit: `Recuperaste permiso.`,
                    subscription: `Recuperaste subscripción.`,
                    state: `Recuperaste estado.`,
                },
                udpate: {
                    city: `Actualizaste ciudad.`,
                    coin: `Actualizaste moneda.`,
                    country: `Actualizaste país.`,
                    payment: `Actualizaste método de pago.`,
                    permit: `Actualizaste permiso.`,
                    subscription: `Actualizaste subscripción.`,
                    state: `Actualizaste estado.`,
                }
            },
            Event: {
                app: {
                    "application.city": `Ciudades`,
                    "application.coin": `Monedas.`,
                    "application.country": `País.`,
                    "application.payment": `Métodos de pago.`,
                    "application.permit": `Permisos.`,
                    "application.state": `Estados.`,
                    "application.user": `Usuarios.`,
                    "application.subscription": `Subscripciones.`,
                    "application": `Aplicación.`,
                },
                object: {
                    "coin": `Monedas.`,
                    "country": `País.`,
                    "payment": `Métodos de pago.`,
                    "permit": `Permisos.`,
                    "state": `Estados.`,
                    "user": `Usuarios.`,
                    "subscription": `Subscripciones.`,
                }
            }
        }
    }

    private DEFAUTL(): TranslateType {
        return this.ES();
    }
    
}