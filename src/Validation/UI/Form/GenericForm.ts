import { ObjectNameType } from "../CRUD/CrudApiInterface";

export type METHOD_HTTP =   `POST` | `GET` | `PUT` | `DELETE`;

export interface Filed {
    key:            string;
    type:           string;
    name:           string;
    value?:         string;
    id:             string;
    placeholder:    string;
    label:          string;
    required:        boolean
}

export interface CheckItem {
    label: string,
    value: string,
} 

export interface Select extends Filed {
    select: boolean;
    selectIn: ObjectNameType
}

export interface Check extends Filed {
    check: boolean;
    childs: CheckItem[],
}

export interface FORM {
    name:       string;
    path:       string;
    method:     METHOD_HTTP;
    fields:     (Filed | Select | Check)[];
    delete?:    boolean
}