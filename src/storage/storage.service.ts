import { Injectable } from '@nestjs/common';
import ConfigDocumentModel from 'src/config/model/document.model';
import { Card } from 'src/validation/types/DashboardInterface';

@Injectable()
export class StorageService {
    constructor(
        private docsModel: ConfigDocumentModel

    ) {}

    public async StorageCard() {
        const sizeByte = await this.docsModel.GetSizeByte({});
        let bytes = sizeByte._sum as any;

        if(bytes.size === null) bytes = {size:0};

        const kilo = bytesToKilobytes(Number(bytes.size));
        const mega = bytesToMegabytes(Number(bytes.size));
        const giga = bytesToGigabytes(Number(bytes.size));

        const customValue = kilo < 1 ? `${bytes.size} B`
            : mega < 1 ? `${kilo} KB`
            : giga < 1 ? `${mega} MG`
            : `${giga} GB`

        // almacenamiento
        const storage: Card = {
            ico: `storage`,
            label: `Almacenamiento`,
            value: customValue,
            child: [
                {
                    label: `Bytes`,
                    value: `${bytes.size} BY`
                },
                {
                    label: `Kilobyte`,
                    value: `${kilo} KB`
                },
                {
                    label: `Megabyte`,
                    value: `${mega} MB`
                },
                {
                    label: `Gigabyte`,
                    value:`${giga} GB`
                }
            ]
        }

        // estudiantes
        // coordinadores
        // proyectos

        // Función para convertir de bytes a kilobytes
        function bytesToKilobytes(bytes: number) {
            return bytes / 1024; // 1 KB = 1024 bytes
        }


        function bytesToMegabytes(bytes: number) {
            return bytes / (1024 * 1024); // 1 MB = 1024 * 1024 bytes
        }

        // Función para convertir de bytes a gigabytes
        function bytesToGigabytes(bytes: number) {
            return bytes / (1024 * 1024 * 1024); // 1 GB = 1024 * 1024 * 1024 bytes
        }

        return storage;
    }

}
