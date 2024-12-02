
export interface UserCreate {

    email:          string;
    username:       string;
    password:       string;
    name:           string;
    lastname:       string;
    rolId:          string;
    parentId?:      string;
    token?:         string;
    ci?:             string;

}

export interface UserUpdate {

    email:          string;
    username:       string;
    password:       string;
    name:           string;
    lastname:       string;
    rolId:          string;
    parentId?:      string;

}
