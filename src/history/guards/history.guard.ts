
export interface HistoryCreate {
    ip:             string;
    browser:        string;
    eventName:      string;
    objectName:     string;
    objectId:       string;
    objectReference:string;
    userId:         string;
}

export interface ProjectHistoryCreate {
    eventName:  string;
    userAuth:   boolean;
    userId:     string;
    projectId:  string;
}
