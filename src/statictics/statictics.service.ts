import { Injectable } from '@nestjs/common';
import AppEvent from 'src/AppEvent';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StaticticsService {

    private date = new Date();

    constructor(
        private prisma: PrismaService,
        private event: AppEvent
    ) {}

    private getObjects () {
        // registro de usuarios 
        // registro de usuarios Estudiantes
        // registro de usuarios ObreroAdministrativo
        // registro de información laboral
        // registro de información educativa
        // registro de trabajos (tambien por categorías)

        return {}
    }

    private async customCreateYear (month: number) {

        await this.prisma.staticticsForYear.create({
            data: {
                year: this.getYear(),
                totalMonth1: month === 1 ? 1 : 0,
                totalMonth2: month === 2 ? 1 : 0,
                totalMonth3: month === 3 ? 1 : 0,
                totalMonth4: month === 4 ? 1 : 0,
                totalMonth5: month === 5 ? 1 : 0,
                totalMonth6: month === 6 ? 1 : 0,
                totalMonth7: month === 7 ? 1 : 0,
                totalMonth8: month === 8 ? 1 : 0,
                totalMonth9: month === 9 ? 1 : 0,
                totalMonth10: month === 10 ? 1 : 0,
                totalMonth11: month === 11 ? 1 : 0,
                totalMonth12: month === 12 ? 1 : 0,
            }
        });          

    }

    private async customUpdateYear (month: number, id: string) {
        // const dayNow = this.getDay();

        await this.prisma.staticticsForYear.update({
            data: {
                year: this.getYear(),
                totalMonth1: month === 1 ? {increment:1} : {increment:0},
                totalMonth2: month === 2 ? {increment:1} : {increment:0},
                totalMonth3: month === 3 ? {increment:1} : {increment:0},
                totalMonth4: month === 4 ? {increment:1} : {increment:0},
                totalMonth5: month === 5 ? {increment:1} : {increment:0},
                totalMonth6: month === 6 ? {increment:1} : {increment:0},
                totalMonth7: month === 7 ? {increment:1} : {increment:0},
                totalMonth8: month === 8 ? {increment:1} : {increment:0},
                totalMonth9: month === 9 ? {increment:1} : {increment:0},
                totalMonth10: month === 10 ? {increment:1} : {increment:0},
                totalMonth11: month === 11 ? {increment:1} : {increment:0},
                totalMonth12: month === 12 ? {increment:1} : {increment:0},
            },
            where: { id }
        });          

    }

    private async customCreateMonth (day: number) {
        const month = this.getMonth();
        // const dayNow = this.getDay();

        await this.prisma.staticticsForMonth.create({
            data: {
                monthName: month.label,
                monthNumber: month.id,
                year: this.getYear(),
                totalDay1: day === 1 ? 1 : 0,
                totalDay2: day === 2 ? 1 : 0,
                totalDay3: day === 3 ? 1 : 0,
                totalDay4: day === 4 ? 1 : 0,
                totalDay5: day === 5 ? 1 : 0,
                totalDay6: day === 6 ? 1 : 0,
                totalDay7: day === 7 ? 1 : 0,
                totalDay8: day === 8 ? 1 : 0,
                totalDay9: day === 9 ? 1 : 0,
                totalDay10: day === 10 ? 1 : 0,
                totalDay11: day === 11 ? 1 : 0,
                totalDay12: day === 12 ? 1 : 0,
                totalDay13: day === 13 ? 1 : 0,
                totalDay14: day === 14 ? 1 : 0,
                totalDay15: day === 15 ? 1 : 0,
                totalDay16: day === 16 ? 1 : 0,
                totalDay17: day === 17 ? 1 : 0,
                totalDay18: day === 18 ? 1 : 0,
                totalDay19: day === 19 ? 1 : 0,
                totalDay20: day === 20 ? 1 : 0,
                totalDay21: day === 21 ? 1 : 0,
                totalDay22: day === 22 ? 1 : 0,
                totalDay23: day === 23 ? 1 : 0,
                totalDay24: day === 24 ? 1 : 0,
                totalDay25: day === 25 ? 1 : 0,
                totalDay26: day === 26 ? 1 : 0,
                totalDay27: day === 27 ? 1 : 0,
                totalDay28: day === 28 ? 1 : 0,
                totalDay29: day === 29 ? 1 : 0,
                totalDay30: day === 30 ? 1 : 0,
                totalDay31: day === 31 ? 1 : 0,
            }
        });          

    }

    private async customUpdateMonth (day: number, id: string) {
        const month = this.getMonth();
        // const dayNow = this.getDay();

        await this.prisma.staticticsForMonth.update({
            data: {
                monthName: month.label,
                monthNumber: month.id,
                year: this.getYear(),
                totalDay1: day === 1 ? {increment:1} : {increment:0},
                totalDay2: day === 2 ? {increment:1} : {increment:0},
                totalDay3: day === 3 ? {increment:1} : {increment:0},
                totalDay4: day === 4 ? {increment:1} : {increment:0},
                totalDay5: day === 5 ? {increment:1} : {increment:0},
                totalDay6: day === 6 ? {increment:1} : {increment:0},
                totalDay7: day === 7 ? {increment:1} : {increment:0},
                totalDay8: day === 8 ? {increment:1} : {increment:0},
                totalDay9: day === 9 ? {increment:1} : {increment:0},
                totalDay10: day === 10 ? {increment:1} : {increment:0},
                totalDay11: day === 11 ? {increment:1} : {increment:0},
                totalDay12: day === 12 ? {increment:1} : {increment:0},
                totalDay13: day === 13 ? {increment:1} : {increment:0},
                totalDay14: day === 14 ? {increment:1} : {increment:0},
                totalDay15: day === 15 ? {increment:1} : {increment:0},
                totalDay16: day === 16 ? {increment:1} : {increment:0},
                totalDay17: day === 17 ? {increment:1} : {increment:0},
                totalDay18: day === 18 ? {increment:1} : {increment:0},
                totalDay19: day === 19 ? {increment:1} : {increment:0},
                totalDay20: day === 20 ? {increment:1} : {increment:0},
                totalDay21: day === 21 ? {increment:1} : {increment:0},
                totalDay22: day === 22 ? {increment:1} : {increment:0},
                totalDay23: day === 23 ? {increment:1} : {increment:0},
                totalDay24: day === 24 ? {increment:1} : {increment:0},
                totalDay25: day === 25 ? {increment:1} : {increment:0},
                totalDay26: day === 26 ? {increment:1} : {increment:0},
                totalDay27: day === 27 ? {increment:1} : {increment:0},
                totalDay28: day === 28 ? {increment:1} : {increment:0},
                totalDay29: day === 29 ? {increment:1} : {increment:0},
                totalDay30: day === 30 ? {increment:1} : {increment:0},
                totalDay31: day === 31 ? {increment:1} : {increment:0},
            },
            where: { id }
        });          

    }

    private getDate () {
        return `${this.date.getDate()}-${this.date.getMonth()}-${this.date.getFullYear()}`;
    }

    private getDay () {
        return this.date.getDate();
    }

    private getMonth () {
        const mth = this.date.getMonth()+1; 

        let label = `Enero`;
        if(mth === 1) label = `Enero`
        else if(mth === 2) label = `Febrero`
        else if(mth === 3) label = `Marzo`
        else if(mth === 4) label = `Abril`
        else if(mth === 5) label = `Mayo`
        else if(mth === 6) label = `Junio`
        else if(mth === 7) label = `Julio`
        else if(mth === 8) label = `Agosto`
        else if(mth === 9) label = `Septiembre`
        else if(mth === 10) label = `Octubre`
        else if(mth === 11) label = `Noviembre`
        else if(mth === 12) label = `Diciembre`
        else label = `Enero`;

        return {
            id: mth,
            label
        };
    }

    private getYear() {
        return this.date.getFullYear();
    }

    private getAllMonth () {
        return [
            { label: `Enero`, id: 1 },
            { label: `Febrero`, id: 2 },
            { label: `Marzo`, id: 3 },
            { label: `Abril`, id: 4 },
            { label: `Mayo`, id: 5 },
            { label: `Junio`, id: 6 },
            { label: `Julio`, id: 7 },
            { label: `Agosto`, id: 8 },
            { label: `Septiembre`, id: 9 },
            { label: `Octubre`, id: 10 },
            { label: `Noviembre`, id: 11 },
            { label: `Diciembre`, id: 12 },
        ]
    }

    private getAllYear () {
        const years = this.prisma.staticticsForYear.groupBy({
            by: 'year',
            orderBy: { year:'desc' }
        })
    }
}
