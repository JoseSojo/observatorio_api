import { Injectable } from '@nestjs/common';
import { Prisma, ConfigCity } from '@prisma/client';
import { GlobalService } from 'src/Service/GlobalService';
import { PrismaService } from 'src/Service/PrismaService';
import { ForYearCreate, ForYearFound, ForYearUpdate } from 'src/Validation/Listener/StaticticsEvent';


@Injectable()
export class StaticticsYearModel {

    constructor(
        private prisma: PrismaService,
        private global: GlobalService
    ) {}

    public async Execute(data: ForYearFound) {
        const months = this.global.GetAllMonth();
        const day = this.global.GetDay();
        const month = data.month ? data.month : this.global.GetMonth();
        const year = data.year ? data.year : this.global.GetYear();
        const found = await this.Found({ name:data.name,year,id:data.id });
        
        if(found) return await this.Increment({ id:found.id, month });

        return await this.Create({ 
            event:`${data.name}`,
            month: month,
            name:data.name,
            year,
            id:data.id 
        });
    }


    public async Create(data: ForYearCreate) {
        return this.prisma.staticticsForYear.create({
            data:{
                objectName: data.name,
                objectReferenceId: data.id,
                year:data.year,
                totalYear: 1,
                totalMonth1: data.month === 1 ? 1 : 0,
                totalMonth2: data.month === 2 ? 1 : 0,
                totalMonth3: data.month === 3 ? 1 : 0,
                totalMonth4: data.month === 4 ? 1 : 0,
                totalMonth5: data.month === 5 ? 1 : 0,
                totalMonth6: data.month === 6 ? 1 : 0,
                totalMonth7: data.month === 7 ? 1 : 0,
                totalMonth8: data.month === 8 ? 1 : 0,
                totalMonth9: data.month === 9 ? 1 : 0,
                totalMonth10: data.month === 10 ? 1 : 0,
                totalMonth11: data.month === 11 ? 1 : 0,
                totalMonth12: data.month === 12 ? 1 : 0,
            }
        });
    }

    public async Increment(data: ForYearUpdate) {
        return this.prisma.staticticsForYear.update({
            where: {id:data.id},
            data:{
                totalYear: { increment:1 },
                totalMonth1: data.month === 1 ? { increment:1 } : { increment:0 },
                totalMonth2: data.month === 2 ? { increment:1 } : { increment:0 },
                totalMonth3: data.month === 3 ? { increment:1 } : { increment:0 },
                totalMonth4: data.month === 4 ? { increment:1 } : { increment:0 },
                totalMonth5: data.month === 5 ? { increment:1 } : { increment:0 },
                totalMonth6: data.month === 6 ? { increment:1 } : { increment:0 },
                totalMonth7: data.month === 7 ? { increment:1 } : { increment:0 },
                totalMonth8: data.month === 8 ? { increment:1 } : { increment:0 },
                totalMonth9: data.month === 9 ? { increment:1 } : { increment:0 },
                totalMonth10: data.month === 10 ? { increment:1 } : { increment:0 },
                totalMonth11: data.month === 11 ? { increment:1 } : { increment:0 },
                totalMonth12: data.month === 12 ? { increment:1 } : { increment:0 },
            }
        });
    }

    public async Found(data: ForYearFound) {
        return this.prisma.staticticsForYear.findFirst({ where:{ AND:[{ year:data.year },{objectName:data.name},{objectReferenceId:data.id}] } });
    }
}
