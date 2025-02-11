export interface LanguajeInterface {

    ACTIONS: ACTIONS_INTERFACE;

    TITLES: TITLES_INTERFACE;

    EVENTS: EVENTS_INTERFACE;

    HISTORY: HISTORY_INTERFACE;

    REPORTS: REPORT_INTERFACE;
}

//
interface ACTIONS_INTERFACE {
    NOT_FOUND:  string;
    NOT_PERMIT: string;
    NOT_VALID:  string;
    
    SUCCESS: {
        CREATE:     string;
        UPDATE:     string;
        LIST:       string;
        SHOW:       string;
        DELETE:     string;
        RECOVERY:   string;
        LOGIN:      string;
        REGISTER:   string;
    };

    DANGER: {
        CREATE:     string;
        UPDATE:     string;
        LIST:       string;
        SHOW:       string;
        DELETE:     string;
        RECOVERY:   string;
        LOGIN:      string;
        REGISTER:   string;

        VALIDATIONS: {
            USERNAME_IN_USE:        string; 
            EMAIL_IN_USE:           string; 
            PASSWORD_FREE:          string;
            CI_IN_USE:              string;
            NAME_IN_USE:            string;

            TITLE_IN_USE:           string;
            SUMARY_LONG_TEXT:       string;
            SUMARY_IN_USE:       string;
            
            FIELDS_REQUIERED: {
                name: string;
                lastname: string;
                username: string;
                email: string;
                password: string;
                ci: string;
                rol: string;
                author: string;
                file: string;
                title:string;
                date:string;
                keywords:string;
                program: string;
                sumary: string;
                id: string;
                category:string;
                state: string;
                municipio: string;
                parroquia: string;

                // educativo
                education: {
                    title: {
                        nivel: string;
                        profesion: string;
                        yearEnd: string;
                        country: string;
                        institucion: string;
                        area: string;
                        subarea: string;
                    },
                    course: {
                        tipe: string;
                        hours: string;
                        country: string;
                        description: string;
                        institucion: string;
                        area: string;
                        subarea: string;
                    }
                }

                work: {
                    type: string;
                    institucion: string;
                    ocupacion: string;
                    cargo: string;
                    dateStart: string;
                    dateEnd: string;

                    dateEndNotNow: string;
                    IsNotNowRequeredDateEnd: string;
                }
            }             
        }
    }
}

//
interface TITLES_INTERFACE {

    INPUT: {
        MATRIZ:     string;
        CATEGORY:   string;
        ID:         string;
        NAME:       string;
        LASTNAME:   string;
        EMAIL:      string;
        PASSWORD:   string;
        DESCRIPTION:string;
        USERNAME:   string;
        PERMIT:     string;
        CI:         string;
        STATE:      string;
        PARROQUIA:  string;
        MUNICIPIO:  string;
    };

    SLIDE: {
        PROJECTS:   string;
        PERMIT:     string;
        REGIONAL: {
            INDEX:  string;
            STATE:      string;
            MUNICIPIO:  string;
            PARROQUIA:  string;
            NUCLEO:     string;
        }
        CONFIG: {
            INDEX:      string;
            CATEGORY:   string;
            PROGRAM:    string;
            LINE:       string;
        };
        USERS:      string;
        DASHBOARD:  string;
        REPORT:     string;
        ANALYSIS:   string;
    },

    NAV: {
        PROFILE:    string;
        LOGOUT:     string;
    },

    CREATE:     string;
    LIST:       string;
    REPORT:     string;
    UNIQUE:     string;
    UPDATE:     string;
    DELETE:     string;
    RECOERY:    string;
    DOWNLOAD:   string;
}

interface EVENTS_INTERFACE {}

interface HISTORY_INTERFACE {}

interface REPORT_INTERFACE {
    PROJECT: OPTIONS_REPORT;
    CATEGORY: OPTIONS_REPORT;
    PROGRAM: OPTIONS_REPORT;
    STATE: OPTIONS_REPORT;
    MUNICIPIO: OPTIONS_REPORT;
    PARROQUIA: OPTIONS_REPORT;
    NUCLEO: OPTIONS_REPORT;
    LINE: OPTIONS_REPORT;
    USER: OPTIONS_REPORT;
}

interface OPTIONS_REPORT {
    many:       string;
    unique:     string;
    project:    string
}

// CREAR Y LISTA
interface CREATE_LIST {
    CREATE:     string;
    LIST:       string;
}

// LISTA
interface LIST {
    LIST:       string;
}

// CREAR
interface CREATE {
    CREATE:     string;
}
