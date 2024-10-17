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
            },
            User: {
                USERNAME_FOUND:`Nombre de usuario en uso.`,
                EMAIL_FOUND:`Correo en uso.`,
                EMAIL_NOT_FOUND:`Correo no valido.`,
                USERNAME_NOT_FOUND:`Nombre de usuario no valido.`
            },
            Required: {
                CITY: `Campo "Ciudad" requerida.`,
                COIN: `Campo "Moneda" requerida.`,
                COUNTRY: `Campo "País" requerida.`,
                EMAIL: `Campo "Correo" requerida.`,
                NAME: `Campo "Nombre" requerida.`,
                PREFIX: `Campo "Prefijo" requerida.`,
                STATE: `Campo "Estado" requerida.`,
                USERNAME: `Campo "Usuario" requerida.`,
                LASTNAME: `Campo "Apellido" requerida.`,
                PASSWORD: `Campo "Contraseña" requerida.`,
                REPEAT_PASSWORD: `Campo "Repetir contraseña" requerida.`,
            }
        }
    }

    private DEFAUTL(): TranslateType {
        return this.ES();
    }
    
}