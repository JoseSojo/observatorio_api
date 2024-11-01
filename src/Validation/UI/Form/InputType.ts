
export interface InputType {
    type:           `text` | `password` | `email` | `number` | `hiden`;
    class?:         string;
    placeholder?:   string;
    value?:         string;
    name?:          string; 
    required:       boolean;
    label:          string; 
}
