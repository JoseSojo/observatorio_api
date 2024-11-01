import { InputType } from "./InputType";

export interface FormType {

    action:             string;
    method:             `POST` | `PUT` | `GET` | `DELETE`;
    inputList:          InputType[]   

}
