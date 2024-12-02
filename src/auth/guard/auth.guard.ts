
export interface AuthLogin {
    param:          string;
    password:       string;
}

export interface Refresh {
    token:          string;
    param:          string;
}

export interface AuthRegister {
    name:           string;
    lastname:       string;
    email:          string;
    username:       string;
    password:       string;
    ci:             string;
}
