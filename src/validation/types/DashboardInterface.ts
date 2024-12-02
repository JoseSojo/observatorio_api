
export interface Card {
    label:      string;
    value:      string | number;
    ico:        string;
    child?: {
        label:      string;
        value:      string;
    }[]
}

export interface Graphic {
    label:      string[];
    value:      number[];
}
