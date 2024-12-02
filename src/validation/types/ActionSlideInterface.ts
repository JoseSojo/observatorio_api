
export interface ActionSlideInterface {
    label:      string;
    ico:        any;
    path:       string;
} 

export interface ActionSlideInterfaceChilds {
    label:      string;
    ico:        any;
    path?:      string;
    childs:     ActionSlideInterface[]
} 

export type ActionsList =
    |   `list`
    |   `create`
    |   `report`

export type ActionsUnique =
    |   `update`
    |   `unique`
    |   `report`
    |   `delete`

export interface ActionCrudInterface {
    label:      string;
    ico:        any;
    path:       string;
    use:        `page` | `modal` | `download`
} 

export interface PermitObject {
    list: string;
    create: string;
    unique: string;
    report: string;
    update: string;
    delete: string;
    download?: string;
}

