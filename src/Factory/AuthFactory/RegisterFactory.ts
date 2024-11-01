import { Injectable } from "@nestjs/common";
import { FormType } from "src/Validation/UI/Form/FormType";
import { InputType } from "src/Validation/UI/Form/InputType";

@Injectable()
export class RegisterFactory {

    public RegisterGUI() {

        const InputList:InputType[] = [
            { required:true, name:`username`, type:`text`, placeholder:`Steven000`, label:`Usuario` },
            { required:true, name:`email`, type:`email`, placeholder:`steven000@ejemplo.com`, label:`Correo` },
            { required:true, name:`name`, type:`text`, placeholder:`Steven`, label:`Nombre` },
            { required:true, name:`lastname`, type:`text`, placeholder:`Evans`, label:`Apellido` },
            { required:true, name:`password`, type:`password`, label:`Contraseña` },
        ] 

        const FromUI: FormType = {
            action: `/auth/register`,
            method: "POST",
            inputList: InputList
        }

        return FromUI;
    }
}
