import { Injectable } from "@nestjs/common";
import { FormType } from "src/Validation/UI/Form/FormType";
import { InputType } from "src/Validation/UI/Form/InputType";

@Injectable()
export class LoginFactory {

    public LoginGUI() {

        const InputList:InputType[] = [
            { required:true, name:`param`, type:`text`, placeholder:`Usuario/Correo`, label:`Usuario o Correo` },
            { required:true, name:`password`, type:`password`, label:`Contraseña` },
        ] 

        const FromUI: FormType = {
            action: `/auth/login`,
            method: "POST",
            inputList: InputList
        }
        
        return FromUI;
    }
}
