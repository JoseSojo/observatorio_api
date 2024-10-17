
export interface TranslateType {
    Action: {
        CREATE:         string;
        UDPATE:         string;
        DELETE:         string;
        RECOVERY:       string;
        GETTING:        string;
        FIND:           string;
        NOT_FOUND:      string;
        NOT_PERMIT:     string;
        NOT_VALID:      string;
        NOT_RESULT:     string;
        NOW_EXIST:      string;
    },
    User: {
        USERNAME_FOUND: string;
        USERNAME_NOT_FOUND: string;
        EMAIL_FOUND: string;
        EMAIL_NOT_FOUND: string;
    },
    Required: {
        EMAIL:      string;
        USERNAME:   string;
        NAME:       string;
        COIN: string;
        STATE: string;
        CITY: string;
        COUNTRY: string;
        PREFIX: string;
        LASTNAME: string;
        PASSWORD: string;
        REPEAT_PASSWORD: string;
    }
}
