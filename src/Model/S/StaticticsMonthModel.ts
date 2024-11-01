import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GlobalService } from 'src/Service/GlobalService';
import { PrismaService } from 'src/Service/PrismaService';
import { EventType } from 'src/Validation/Event';
import { ForMonthCreate, ForMonthFound, ForMonthUpdate } from 'src/Validation/Listener/StaticticsEvent';


@Injectable()
export class StaticticsMonthModel {

    constructor(
        private prisma: PrismaService,
        private global: GlobalService
    ) {}

    public async GetStatictics({event,month,id,year}:{month:number,id?:string,event:EventType,year:number}) {
        return this.prisma.staticticsForMonth.findFirst({
            where: {
                AND: [
                    { monthNumber: month },
                    { objectName: event },
                    { objectReferenceId: id ? id : `application` },
                    { year: year },
                ]
            }
        })
    }

    public async Execute(data: ForMonthFound) {
        const months = this.global.GetAllMonth();
        const day = this.global.GetDay();
        const month = data.month ? data.month : this.global.GetMonth();
        const year = data.year ? data.year : this.global.GetYear();

        if(data.name === `user`) {
            const found = await this.Found({ AND:[{objectReferenceId:data.id,monthNumber:month,year}] });
            if(found) return await this.Increment({ day, id:found.id });

            return await this.Create({ 
                day, 
                index:month, 
                event:`${data.name}`, 
                monthName:months[month-1],
                name:data.name,
                year,
                id:data.id 
            });
        }

        if(data.id) {
            const found = await this.Found({ AND:[{objectName:data.name,id:data.id,monthNumber:month,year}] });
            if(found) return await this.Increment({ day, id:found.id });

            return await this.Create({ 
                day, 
                index:month, 
                event:`${data.name}`, 
                monthName:months[month-1],
                name:data.name,
                year,
                id:data.id 
            });
        }

        const found = await this.Found({ AND:[{ monthNumber:month,year, objectName:data.name}] });
        
        if(found) return await this.Increment({ day, id:found.id });

        return await this.Create({ 
            day, 
            index:month, 
            event:`${data.name}`, 
            monthName:months[month-1],
            name:data.name,
            year,
            id:data.id 
        });
    }

    private async Create(data: ForMonthCreate) {
        return this.prisma.staticticsForMonth.create({
            data:{
                objectName: data.name,
                objectReferenceId: data.id,
                monthName: data.monthName,
                monthNumber: data.index,
                year:data.year,
                totalMonth: 1,
                totalDay1: data.day === 1 ? 1 : 0,
                totalDay2: data.day === 2 ? 1 : 0,
                totalDay3: data.day === 3 ? 1 : 0,
                totalDay4: data.day === 4 ? 1 : 0,
                totalDay5: data.day === 5 ? 1 : 0,
                totalDay6: data.day === 6 ? 1 : 0,
                totalDay7: data.day === 7 ? 1 : 0,
                totalDay8: data.day === 8 ? 1 : 0,
                totalDay9: data.day === 9 ? 1 : 0,
                totalDay10: data.day === 10 ? 1 : 0,
                totalDay11: data.day === 11 ? 1 : 0,
                totalDay12: data.day === 12 ? 1 : 0,
                totalDay13: data.day === 13 ? 1 : 0,
                totalDay14: data.day === 14 ? 1 : 0,
                totalDay15: data.day === 15 ? 1 : 0,
                totalDay16: data.day === 16 ? 1 : 0,
                totalDay17: data.day === 17 ? 1 : 0,
                totalDay18: data.day === 18 ? 1 : 0,
                totalDay19: data.day === 19 ? 1 : 0,
                totalDay20: data.day === 20 ? 1 : 0,
                totalDay21: data.day === 21 ? 1 : 0,
                totalDay22: data.day === 22 ? 1 : 0,
                totalDay23: data.day === 23 ? 1 : 0,
                totalDay24: data.day === 24 ? 1 : 0,
                totalDay25: data.day === 25 ? 1 : 0,
                totalDay26: data.day === 26 ? 1 : 0,
                totalDay27: data.day === 27 ? 1 : 0,
                totalDay28: data.day === 28 ? 1 : 0,
                totalDay29: data.day === 29 ? 1 : 0,
                totalDay30: data.day === 30 ? 1 : 0,
                totalDay31: data.day === 31 ? 1 : 0,
            }
        });
    }

    private async Increment(data: ForMonthUpdate) {
        return this.prisma.staticticsForMonth.update({
            where: {id:data.id},
            data:{
                totalMonth: { increment:1 },
                totalDay1: data.day === 1 ? { increment:1 } : { increment:0 },
                totalDay2: data.day === 2 ? { increment:1 } : { increment:0 },
                totalDay3: data.day === 3 ? { increment:1 } : { increment:0 },
                totalDay4: data.day === 4 ? { increment:1 } : { increment:0 },
                totalDay5: data.day === 5 ? { increment:1 } : { increment:0 },
                totalDay6: data.day === 6 ? { increment:1 } : { increment:0 },
                totalDay7: data.day === 7 ? { increment:1 } : { increment:0 },
                totalDay8: data.day === 8 ? { increment:1 } : { increment:0 },
                totalDay9: data.day === 9 ? { increment:1 } : { increment:0 },
                totalDay10: data.day === 10 ? { increment:1 } : { increment:0 },
                totalDay11: data.day === 11 ? { increment:1 } : { increment:0 },
                totalDay12: data.day === 12 ? { increment:1 } : { increment:0 },
                totalDay13: data.day === 13 ? { increment:1 } : { increment:0 },
                totalDay14: data.day === 14 ? { increment:1 } : { increment:0 },
                totalDay15: data.day === 15 ? { increment:1 } : { increment:0 },
                totalDay16: data.day === 16 ? { increment:1 } : { increment:0 },
                totalDay17: data.day === 17 ? { increment:1 } : { increment:0 },
                totalDay18: data.day === 18 ? { increment:1 } : { increment:0 },
                totalDay19: data.day === 19 ? { increment:1 } : { increment:0 },
                totalDay20: data.day === 20 ? { increment:1 } : { increment:0 },
                totalDay21: data.day === 21 ? { increment:1 } : { increment:0 },
                totalDay22: data.day === 22 ? { increment:1 } : { increment:0 },
                totalDay23: data.day === 23 ? { increment:1 } : { increment:0 },
                totalDay24: data.day === 24 ? { increment:1 } : { increment:0 },
                totalDay25: data.day === 25 ? { increment:1 } : { increment:0 },
                totalDay26: data.day === 26 ? { increment:1 } : { increment:0 },
                totalDay27: data.day === 27 ? { increment:1 } : { increment:0 },
                totalDay28: data.day === 28 ? { increment:1 } : { increment:0 },
                totalDay29: data.day === 29 ? { increment:1 } : { increment:0 },
                totalDay30: data.day === 30 ? { increment:1 } : { increment:0 },
                totalDay31: data.day === 31 ? { increment:1 } : { increment:0 },
            }
        });
    }

    private async Found(filter: Prisma.StaticticsForMonthWhereInput) {
        return this.prisma.staticticsForMonth.findFirst({ where:filter });
    }
}
