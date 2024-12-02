import { Injectable } from "@nestjs/common";

@Injectable()
export default class AppCategory {

    public TD = {
        id: `TD`,
        name: `Tesis Doctoral`,
    }

    public TE = {
        id: `TE`,
        name: `Trabajo de Grado`,
    }

    public TEG = {
        id: `TEG`,
        name: `Trabajo especial de Grado`,
    }

}
