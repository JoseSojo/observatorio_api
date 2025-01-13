
export interface EducationCreate {
    area: string,
    countryId: string,
    institucion: string,
    nivel: string,
    profesion: string,
    subarea: string,
    yearEnd: string,

    userId:             string
}

export interface CursoCreate {
    tipo: string,
    horas: number,
    country: string,
    institucion: string,
    description: string,
    area: string,
    subarea: string,

    userId:             string
}

export interface EducationUpdate {
    type:               String;
    titulo:             String;
    institucion:        String;
    dateStart:          Date;
    dateEnd:            Date;
    duration?:          number;
    ubication:          String;
    formato:            String;
}
