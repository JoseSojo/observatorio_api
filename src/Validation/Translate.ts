
export interface TranslateType {
    Action: {
        CREATE:                 string;
        UDPATE:                 string;
        DELETE:                 string;
        RECOVERY:               string;
        GETTING:                string;
        FIND:                   string;
        NOT_FOUND:              string;
        NOT_PERMIT:             string;
        NOT_VALID:              string;
        NOT_RESULT:             string;
        NOW_EXIST:              string;
        PASSWORD_NOT_MATCH:     string;
        PASSWORD_NOT_VALID:     string;
        PASSWORD_REQUETS:       string;
        PASSWORD_CHANGE:       string;
    },
    Auth: {
        ACCESS_EMAIL: string,
        ACCESS_PASSWORD: string,
        ACCESS: string,
        SUCCESS: string
    },
    User: {
        USERNAME_FOUND:         string;
        USERNAME_NOT_FOUND:     string;
        EMAIL_FOUND:            string;
        EMAIL_NOT_FOUND:        string;
    },
    Required: {
        EMAIL:              string;
        USERNAME:           string;
        NAME:               string;
        COIN:               string;
        STATE:              string;
        CITY:               string;
        COUNTRY:            string;
        PREFIX:             string;
        LASTNAME:           string;
        PASSWORD:           string;
        REPEAT_PASSWORD:    string;
        DESCRIPTION:        string;
        PERCENJATE:         string;
        FREE_MONTH:         string;
    },
    Slide: {
        user:           string;
        country:        string;
        master:         string
        city:           string,
        subscription:   string;
        coin:           string;
        payment:        string;
        permit:         string;
        state:          string;
    },
    Input: {
        name:           string,
        lastname:           string,
        username:           string,
        email:              string,
        password:           string,
        city:               string,
        conuntry:           string,
        permit:             string,
        nowPassword:        string,
        newPassword:        string,
        repeatPassword:     string,
        prefix:             string,
        description:        string,
        prefixPhone:        string,
        coin:               string,
        state:              string,
        dpercentaje_discount:string,
        free_month:         string;
    },
    Placeholder: {
        name:           string,
        lastname:       string,
        username:       string,
        email:          string,
        city:           string,
        conuntry:       string,
        permit:         string,
    },
    Titles: {
        Statictics: {
            pie: {
                "role.user": string,
                "coin.payment": string,
                "country.state": string,
                "city.state": string,
                "subscription.user": string,
            }, 
            graphics: {}
        },
        Sections: {
            history: string;
        }
        Form: {
            profile: {
                data:       string;
                password:   string;
                photo:      string;
            }
            create: string;
            update: string;
            delete: string;
        },
        Crud: {
            conuntry:       string;
            state:          string;
            city:           string;
            coin:           string;
            payment:        string;
            subscription:   string;
            permit:         string;
            user:           string;
        }
    },
    Permit: {
        create: string,
        update: string,
        list: string,
        unique: string,
        delete: string,
        restore: string,
        profile: {
            profile: string,
            update: string,
            password: string,
            photo: string,
            statictics_month: string,
            statictics_year: string,
            notifications: string
        },
        statictics: {
            month: string,
            year: string
        },
    },
    Notification: {
        create: {
            country: string,
            state: string,
            city: string,
            coin: string,
            payment: string,
            subscription: string,
            permit: string,
        },
        udpate: {
            country: string,
            state: string,
            city: string,
            coin: string,
            payment: string,
            subscription: string,
            permit: string,
        }, 
        delete: {
            country: string,
            state: string,
            city: string,
            coin: string,
            payment: string,
            subscription: string,
            permit: string,
        },
        recovery: {
            country: string,
            state: string,
            city: string,
            coin: string,
            payment: string,
            subscription: string,
            permit: string,
        }
    },
    Event: {
        app: {
            "application": string,
            "application.country": string,
            "application.city": string,
            "application.coin": string,
            "application.user": string,
            "application.payment": string,
            "application.state": string,
            "application.permit": string,
            "application.subscription": string,
        }
        object: {
            "country": string,
            "coin": string,
            "user": string,
            "payment": string,
            "state": string,
            "permit": string,
            "subscription": string,
        }
    }

}
