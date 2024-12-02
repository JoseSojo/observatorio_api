import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationService {

    public isEmail(param: string) {
        /**
         * Valida una dirección de correo electrónico básica. Exige al menos un carácter antes del @, un @, 
         * al menos un carácter antes del punto y al menos un punto seguido de al menos un carácter.
         */
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(param);
    }

    public isPassword(param: string) {
        /**
         * Exige al menos una letra (mayúscula o minúscula) y un número, con una longitud mínima de 8 caracteres. 
         * Puedes agregar más complejidad si lo deseas, como exigir caracteres especiales o una combinación específica 
         * de tipos de caracteres.
         */
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(param);
    }

    public isNumber(param: string) {
        /**
         * Valida una cadena compuesta únicamente por dígitos numéricos.
         */
        const regex = /^\d+$/;
        return regex.test(param);
    }

    public isName(param: string) {
        /**
         * Permite letras mayúsculas y minúsculas, incluyendo vocales con acentos, así como espacios en blanco.
         * Para una mayor precisión, podrías restringir el inicio y final de la cadena a letras y limitar la 
         * cantidad de espacios consecutivos.
         */
        const regex = /^[a-zA-ZÀ-ÿ\s]+$/;
        return regex.test(param);
    }

    public isDateYYYYMMDD(param: string) {
        /**
         * Formato YYYY-MM-DD
         */
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(param);
    }

    public isDateDDMMYYYY(param: string) {
        /**
         * Formato YYYY-MM-DD
         */
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        return regex.test(param);
    }

    public isIPv4 (param: string) {
        const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return regex.test(param);
    }

    public maximo250(param: string) {
        /**
         * Permite cualquier carácter (excepto nueva línea), con una longitud máxima de 250 caracteres.
         */
        const regex = /^.{0,250}$/
        return regex.test(param);
    }

}
