
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
    title?: string;
    cols?: string;
    label:      string[];
    value:      number[];
}
