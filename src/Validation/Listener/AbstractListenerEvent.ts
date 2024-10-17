
export interface AbstractListenerEvent {
    event:              string; // evento creación, actualización, eliminación, restauración x y z
    id?:                 string; // id del objeto obligatirio
    objectName:         string; // nombre del objeto usuario, application, moneda, x y z
    country?:           string; // pais en caso de que aplique
    user?:              string; // usuario para estadisticas de usuarios
}
