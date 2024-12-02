import { Injectable } from "@nestjs/common";

@Injectable()
export default class AppEvent {

    public readonly EVENT_CATEGORY_CREATE = `EVENT_CATEGORY_CREATE`;  
    public readonly EVENT_CATEGORY_UPDATE = `EVENT_CATEGORY_UPDATE`;  
    public readonly EVENT_CATEGORY_DELETE = `EVENT_CATEGORY_DELETE`;  
    public readonly EVENT_CATEGORY_RECOVERY = `EVENT_CATEGORY_RECOVERY`;  

    public readonly EVENT_PROGRAM_CREATE = `EVENT_PROGRAM_CREATE`;  
    public readonly EVENT_PROGRAM_UPDATE = `EVENT_PROGRAM_UPDATE`;  
    public readonly EVENT_PROGRAM_DELETE = `EVENT_PROGRAM_DELETE`;  
    public readonly EVENT_PROGRAM_RECOVERY = `EVENT_PROGRAM_RECOVERY`;  

    public readonly EVENT_LINE_CREATE = `EVENT_LINE_CREATE`;  
    public readonly EVENT_LINE_UPDATE = `EVENT_LINE_UPDATE`;  
    public readonly EVENT_LINE_DELETE = `EVENT_LINE_DELETE`;  
    public readonly EVENT_LINE_RECOVERY = `EVENT_LINE_RECOVERY`;  

    public readonly EVENT_USER_CREATE = `EVENT_USER_CREATE`;  
    public readonly EVENT_USER_UPDATE = `EVENT_USER_UPDATE`;  
    public readonly EVENT_USER_DELETE = `EVENT_USER_DELETE`;  
    public readonly EVENT_USER_RECOVERY = `EVENT_USER_RECOVERY`;  

    public readonly EVENT_PROJECT_CREATE        = `EVENT_PROJECT_CREATE`;  
    public readonly EVENT_PROJECT_UPDATE        = `EVENT_PROJECT_UPDATE`;  
    public readonly EVENT_PROJECT_SET_PUBLIC    = `EVENT_PROJECT_SET_PUBLIC`;
    public readonly EVENT_PROJECT_SET_DOWNLOAD  = `EVENT_PROJECT_SET_DOWNLOAD`;
    public readonly EVENT_PROJECT_DELETE        = `EVENT_PROJECT_DELETE`;  
    public readonly EVENT_PROJECT_RECOVERY      = `EVENT_PROJECT_RECOVERY`;  

}
