
export interface WorkCreate {
    actual: boolean
    tipoInstitucion: string
    institucion: string
    ocupacion: string
    cargo: string
    dateStart: Date
    dateEnd?: Date

    userId:             string
}

export interface WorkUpdate {
    actual: string
    tipoInstitucion: string
    institucion: string
    ocupacion: string
    cargo: string
    dateStart: Date
    dateEnd: Date
}
