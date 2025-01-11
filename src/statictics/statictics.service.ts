import { Injectable } from '@nestjs/common';
import AppEvent from 'src/AppEvent';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StaticticsService {

    private date = new Date();

    constructor(
        private prisma: PrismaService,
        private event: AppEvent
    ) { }

    /**
     * STATICTiCS FOR USER 
     */
    public async currentStaticticsUser({ day, month, year,category }: { day: number, month: number, year: number, category?:string }) {
        const object = category || this.event.STATICTICS_CREATE_USER;

        const staticticsFoundMonthPromise = this.prisma.staticticsUserForMonth.findFirst({ where: { monthNumber: month } });
        const staticticsFoundYearPromise = this.prisma.staticticsUserForYear.findFirst({ where: { year } });
        const staticticsFoundCenturyPromise = this.prisma.staticticsUserForCentury.findFirst({ where: { year } });

        const staticticsFoundMonth = await staticticsFoundMonthPromise;
        const staticticsFoundYear = await staticticsFoundYearPromise;
        const staticticsFoundCentury = await staticticsFoundCenturyPromise;

        if (staticticsFoundMonth) {
            await this.customUpdateMonthUser(day, staticticsFoundMonth.id);
        } else {
            await this.customCreateMonthUser(day, object)
        }

        if (staticticsFoundYear) {
            await this.customUpdateYearUser(month, staticticsFoundYear.id)
        } else {
            await this.customCreateYearUser(month, object);
        }

        if (staticticsFoundCentury) {
            await this.customUpdateCenturyUser(staticticsFoundCentury.id);
        } else {
            await this.customCreateCenturyUser(year, object)
        }
    }

    public async getStaticsUser({ day, month, year }: { day: number, month: number, year: number }) {
        const object = this.event.STATICTICS_CREATE_USER;
        const userMonthPromise = this.prisma.staticticsUserForMonth.findMany({ where: { AND: [{ monthNumber: month }] } });
        const userYearPromise = this.prisma.staticticsUserForYear.findMany({ where: { AND: [{ year: year }] } });
        const userCenturyPromise = this.prisma.staticticsUserForCentury.findMany({});

        const umList = await userMonthPromise;
        const uyList = await userYearPromise;
        // const uc = await userCenturyPromise;

        const valueMonth: { label: string, value: any[] }[] = []
        umList.forEach((um) => {
            const currentValue = [
                um.totalDay1, um.totalDay2, um.totalDay3, um.totalDay4, um.totalDay5, um.totalDay6, um.totalDay7, um.totalDay8, um.totalDay9, um.totalDay10,
                um.totalDay11, um.totalDay12, um.totalDay13, um.totalDay14, um.totalDay15, um.totalDay16, um.totalDay17, um.totalDay18, um.totalDay19, um.totalDay20,
                um.totalDay21, um.totalDay22, um.totalDay23, um.totalDay24, um.totalDay25, um.totalDay26, um.totalDay27, um.totalDay28, um.totalDay29, um.totalDay30,
                um.totalDay10
            ];
            valueMonth.push({ label: um.objectName === `STATICTICS_CREATE_USER` ? `Todos` : um.objectName, value: currentValue });
        })

        const valueYear: { label: string, value: any[] }[] = [];
        uyList.forEach((uy) => {
            const currentValue = [
                uy.totalMonth1,
                uy.totalMonth2,
                uy.totalMonth3,
                uy.totalMonth4,
                uy.totalMonth5,
                uy.totalMonth6,
                uy.totalMonth7,
                uy.totalMonth8,
                uy.totalMonth9,
                uy.totalMonth10,
                uy.totalMonth11,
                uy.totalMonth12,
            ];
            valueYear.push({ label: uy.objectName === `STATICTICS_CREATE_USER` ? `Todos` : uy.objectName, value: currentValue });

        })
        // const valueCentury = [];
        // uc.forEach(item => {
        //     valueCentury.push(item.totalYear)
        // });

        return {
            month: valueMonth,
            // totalMonth: um.totalMonth,

            year: valueYear,
            // totalYear: uy.totalYear,

            // century: valueCentury,
            // totalCentury: 0,
        }
    }

    private async customCreateYearUser(month: number, object: string) {
        try {
            await this.prisma.staticticsUserForYear.create({
                data: {
                    objectName: object,
                    year: this.getYear(),
                    totalYear: 1,
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
        } catch (error) {
        }
    }

    private async customUpdateYearUser(month: number, id: string) {
        // const dayNow = this.getDay();

        await this.prisma.staticticsUserForYear.update({
            data: {
                year: this.getYear(),
                totalMonth1: month === 1 ? { increment: 1 } : { increment: 0 },
                totalMonth2: month === 2 ? { increment: 1 } : { increment: 0 },
                totalMonth3: month === 3 ? { increment: 1 } : { increment: 0 },
                totalMonth4: month === 4 ? { increment: 1 } : { increment: 0 },
                totalMonth5: month === 5 ? { increment: 1 } : { increment: 0 },
                totalMonth6: month === 6 ? { increment: 1 } : { increment: 0 },
                totalMonth7: month === 7 ? { increment: 1 } : { increment: 0 },
                totalMonth8: month === 8 ? { increment: 1 } : { increment: 0 },
                totalMonth9: month === 9 ? { increment: 1 } : { increment: 0 },
                totalMonth10: month === 10 ? { increment: 1 } : { increment: 0 },
                totalMonth11: month === 11 ? { increment: 1 } : { increment: 0 },
                totalMonth12: month === 12 ? { increment: 1 } : { increment: 0 },
            },
            where: { id }
        });

    }

    private async customCreateMonthUser(day: number, object: string) {
        const month = this.getMonth();
        // const dayNow = this.getDay();

        await this.prisma.staticticsUserForMonth.create({
            data: {
                monthName: month.label,
                objectName: object,
                monthNumber: month.id,
                year: this.getYear(),
                totalMonth: 1,
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

    private async customUpdateMonthUser(day: number, id: string) {
        const month = this.getMonth();
        // const dayNow = this.getDay();

        await this.prisma.staticticsUserForMonth.update({
            data: {
                monthName: month.label,
                monthNumber: month.id,
                year: this.getYear(),
                totalMonth: { increment: 1 },
                totalDay1: day === 1 ? { increment: 1 } : { increment: 0 },
                totalDay2: day === 2 ? { increment: 1 } : { increment: 0 },
                totalDay3: day === 3 ? { increment: 1 } : { increment: 0 },
                totalDay4: day === 4 ? { increment: 1 } : { increment: 0 },
                totalDay5: day === 5 ? { increment: 1 } : { increment: 0 },
                totalDay6: day === 6 ? { increment: 1 } : { increment: 0 },
                totalDay7: day === 7 ? { increment: 1 } : { increment: 0 },
                totalDay8: day === 8 ? { increment: 1 } : { increment: 0 },
                totalDay9: day === 9 ? { increment: 1 } : { increment: 0 },
                totalDay10: day === 10 ? { increment: 1 } : { increment: 0 },
                totalDay11: day === 11 ? { increment: 1 } : { increment: 0 },
                totalDay12: day === 12 ? { increment: 1 } : { increment: 0 },
                totalDay13: day === 13 ? { increment: 1 } : { increment: 0 },
                totalDay14: day === 14 ? { increment: 1 } : { increment: 0 },
                totalDay15: day === 15 ? { increment: 1 } : { increment: 0 },
                totalDay16: day === 16 ? { increment: 1 } : { increment: 0 },
                totalDay17: day === 17 ? { increment: 1 } : { increment: 0 },
                totalDay18: day === 18 ? { increment: 1 } : { increment: 0 },
                totalDay19: day === 19 ? { increment: 1 } : { increment: 0 },
                totalDay20: day === 20 ? { increment: 1 } : { increment: 0 },
                totalDay21: day === 21 ? { increment: 1 } : { increment: 0 },
                totalDay22: day === 22 ? { increment: 1 } : { increment: 0 },
                totalDay23: day === 23 ? { increment: 1 } : { increment: 0 },
                totalDay24: day === 24 ? { increment: 1 } : { increment: 0 },
                totalDay25: day === 25 ? { increment: 1 } : { increment: 0 },
                totalDay26: day === 26 ? { increment: 1 } : { increment: 0 },
                totalDay27: day === 27 ? { increment: 1 } : { increment: 0 },
                totalDay28: day === 28 ? { increment: 1 } : { increment: 0 },
                totalDay29: day === 29 ? { increment: 1 } : { increment: 0 },
                totalDay30: day === 30 ? { increment: 1 } : { increment: 0 },
                totalDay31: day === 31 ? { increment: 1 } : { increment: 0 },
            },
            where: { id }
        });

    }

    private async customCreateCenturyUser(year: number, object: string) {

        await this.prisma.staticticsUserForCentury.create({
            data: {
                objectName: object,
                year,
                totalYear: 1,
            }
        });

    }

    private async customUpdateCenturyUser(id: string) {
        await this.prisma.staticticsUserForCentury.update({
            data: {
                totalYear: { increment: 1 },
            },
            where: { id }
        });

    }

    /**
     * STATICTiCS FOR PROJECTS 
     */
    public async currentStaticticsProject({ day, month, year, categoryName }: { day: number, month: number, year: number, categoryName?: string }) {
        const object = categoryName || this.event.STATICTICS_CREATE_PROJECT;

        const staticticsFoundMonthPromise = this.prisma.staticticsProjectForMonth.findFirst({ where: { AND: [{ monthNumber: month }, { objectName: object }] } });
        const staticticsFoundYearPromise = this.prisma.staticticsProjectForYear.findFirst({ where: { AND: [{ year }, { objectName: object }] } });
        const staticticsFoundCenturyPromise = this.prisma.staticticsProjectForCentury.findFirst({ where: { AND: [{ year }, { objectName: object }] } });

        const staticticsFoundMonth = await staticticsFoundMonthPromise;
        const staticticsFoundYear = await staticticsFoundYearPromise;
        const staticticsFoundCentury = await staticticsFoundCenturyPromise;

        if (staticticsFoundMonth) {
            await this.customUpdateMonthProject(day, staticticsFoundMonth.id);
        } else {
            await this.customCreateMonthProject(day, object)
        }

        if (staticticsFoundYear) {
            await this.customUpdateYearProject(month, staticticsFoundYear.id)
        } else {
            await this.customCreateYearProject(month, object);
        }

        if (staticticsFoundCentury) {
            await this.customUpdateCenturyProject(staticticsFoundCentury.id);
        } else {
            await this.customCreateCenturyProject(year, object)
        }
    }

    public async getStaticsProject({ day, month, year }: { day: number, month: number, year: number }) {
        const object = this.event.STATICTICS_CREATE_PROJECT;
        const projectMonthPromise = this.prisma.staticticsProjectForMonth.findMany({ where: { AND: [{ monthNumber: month }] } });
        const projectYearPromise = this.prisma.staticticsProjectForYear.findMany({ where: { AND: [{ year: year }] } });
        // const projectCenturyPromise = this.prisma.staticticsProjectForCentury.findMany();

        const umList = await projectMonthPromise;
        const uyList = await projectYearPromise;

        const valueMonth: { label: string, value: any[] }[] = []

        umList.forEach((um) => {
            const currentValue = [
                um.totalDay1, um.totalDay2, um.totalDay3, um.totalDay4, um.totalDay5, um.totalDay6, um.totalDay7, um.totalDay8, um.totalDay9, um.totalDay10,
                um.totalDay11, um.totalDay12, um.totalDay13, um.totalDay14, um.totalDay15, um.totalDay16, um.totalDay17, um.totalDay18, um.totalDay19, um.totalDay20,
                um.totalDay21, um.totalDay22, um.totalDay23, um.totalDay24, um.totalDay25, um.totalDay26, um.totalDay27, um.totalDay28, um.totalDay29, um.totalDay30,
                um.totalDay10
            ];
            valueMonth.push({ label: um.objectName === `STATICTICS_CREATE_PROJECT` ? `Todos` : um.objectName, value: currentValue });
        })

        const valueYear: { label: string, value: any[] }[] = [];

        uyList.forEach((uy) => {
            const currentValue = [
                uy.totalMonth1,
                uy.totalMonth2,
                uy.totalMonth3,
                uy.totalMonth4,
                uy.totalMonth5,
                uy.totalMonth6,
                uy.totalMonth7,
                uy.totalMonth8,
                uy.totalMonth9,
                uy.totalMonth10,
                uy.totalMonth11,
                uy.totalMonth12,
            ];
            valueYear.push({ label: uy.objectName === `STATICTICS_CREATE_PROJECT` ? `Todos` : uy.objectName, value: currentValue });

        })

        return {
            month: valueMonth,

            year: valueYear,
        }
    }

    private async customCreateYearProject(month: number, object: string) {
        try {
            await this.prisma.staticticsProjectForYear.create({
                data: {
                    objectName: object,
                    year: this.getYear(),
                    totalYear: 1,
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
        } catch (error) {
        }
    }

    private async customUpdateYearProject(month: number, id: string) {
        // const dayNow = this.getDay();

        await this.prisma.staticticsProjectForYear.update({
            data: {
                year: this.getYear(),
                totalMonth1: month === 1 ? { increment: 1 } : { increment: 0 },
                totalMonth2: month === 2 ? { increment: 1 } : { increment: 0 },
                totalMonth3: month === 3 ? { increment: 1 } : { increment: 0 },
                totalMonth4: month === 4 ? { increment: 1 } : { increment: 0 },
                totalMonth5: month === 5 ? { increment: 1 } : { increment: 0 },
                totalMonth6: month === 6 ? { increment: 1 } : { increment: 0 },
                totalMonth7: month === 7 ? { increment: 1 } : { increment: 0 },
                totalMonth8: month === 8 ? { increment: 1 } : { increment: 0 },
                totalMonth9: month === 9 ? { increment: 1 } : { increment: 0 },
                totalMonth10: month === 10 ? { increment: 1 } : { increment: 0 },
                totalMonth11: month === 11 ? { increment: 1 } : { increment: 0 },
                totalMonth12: month === 12 ? { increment: 1 } : { increment: 0 },
            },
            where: { id }
        });

    }

    private async customCreateMonthProject(day: number, object: string) {
        const month = this.getMonth();
        // const dayNow = this.getDay();

        await this.prisma.staticticsProjectForMonth.create({
            data: {
                monthName: month.label,
                objectName: object,
                monthNumber: month.id,
                year: this.getYear(),
                totalMonth: 1,
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

    private async customUpdateMonthProject(day: number, id: string) {
        const month = this.getMonth();
        // const dayNow = this.getDay();

        await this.prisma.staticticsProjectForMonth.update({
            data: {
                monthName: month.label,
                monthNumber: month.id,
                year: this.getYear(),
                totalMonth: { increment: 1 },
                totalDay1: day === 1 ? { increment: 1 } : { increment: 0 },
                totalDay2: day === 2 ? { increment: 1 } : { increment: 0 },
                totalDay3: day === 3 ? { increment: 1 } : { increment: 0 },
                totalDay4: day === 4 ? { increment: 1 } : { increment: 0 },
                totalDay5: day === 5 ? { increment: 1 } : { increment: 0 },
                totalDay6: day === 6 ? { increment: 1 } : { increment: 0 },
                totalDay7: day === 7 ? { increment: 1 } : { increment: 0 },
                totalDay8: day === 8 ? { increment: 1 } : { increment: 0 },
                totalDay9: day === 9 ? { increment: 1 } : { increment: 0 },
                totalDay10: day === 10 ? { increment: 1 } : { increment: 0 },
                totalDay11: day === 11 ? { increment: 1 } : { increment: 0 },
                totalDay12: day === 12 ? { increment: 1 } : { increment: 0 },
                totalDay13: day === 13 ? { increment: 1 } : { increment: 0 },
                totalDay14: day === 14 ? { increment: 1 } : { increment: 0 },
                totalDay15: day === 15 ? { increment: 1 } : { increment: 0 },
                totalDay16: day === 16 ? { increment: 1 } : { increment: 0 },
                totalDay17: day === 17 ? { increment: 1 } : { increment: 0 },
                totalDay18: day === 18 ? { increment: 1 } : { increment: 0 },
                totalDay19: day === 19 ? { increment: 1 } : { increment: 0 },
                totalDay20: day === 20 ? { increment: 1 } : { increment: 0 },
                totalDay21: day === 21 ? { increment: 1 } : { increment: 0 },
                totalDay22: day === 22 ? { increment: 1 } : { increment: 0 },
                totalDay23: day === 23 ? { increment: 1 } : { increment: 0 },
                totalDay24: day === 24 ? { increment: 1 } : { increment: 0 },
                totalDay25: day === 25 ? { increment: 1 } : { increment: 0 },
                totalDay26: day === 26 ? { increment: 1 } : { increment: 0 },
                totalDay27: day === 27 ? { increment: 1 } : { increment: 0 },
                totalDay28: day === 28 ? { increment: 1 } : { increment: 0 },
                totalDay29: day === 29 ? { increment: 1 } : { increment: 0 },
                totalDay30: day === 30 ? { increment: 1 } : { increment: 0 },
                totalDay31: day === 31 ? { increment: 1 } : { increment: 0 },
            },
            where: { id }
        });

    }

    private async customCreateCenturyProject(year: number, object: string) {

        await this.prisma.staticticsProjectForCentury.create({
            data: {
                objectName: object,
                year,
                totalYear: 1,
            }
        });

    }

    private async customUpdateCenturyProject(id: string) {
        await this.prisma.staticticsProjectForCentury.update({
            data: {
                totalYear: { increment: 1 },
            },
            where: { id }
        });

    }

    private getObjects() {
        // registro de usuarios 
        // registro de usuarios Estudiantes
        // registro de usuarios ObreroAdministrativo
        // registro de información laboral
        // registro de información educativa
        // registro de trabajos (tambien por categorías)

        return {}
    }

    private async customCreateYear(month: number) {

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

    private async customUpdateYear(month: number, id: string) {
        // const dayNow = this.getDay();

        await this.prisma.staticticsForYear.update({
            data: {
                year: this.getYear(),
                totalMonth1: month === 1 ? { increment: 1 } : { increment: 0 },
                totalMonth2: month === 2 ? { increment: 1 } : { increment: 0 },
                totalMonth3: month === 3 ? { increment: 1 } : { increment: 0 },
                totalMonth4: month === 4 ? { increment: 1 } : { increment: 0 },
                totalMonth5: month === 5 ? { increment: 1 } : { increment: 0 },
                totalMonth6: month === 6 ? { increment: 1 } : { increment: 0 },
                totalMonth7: month === 7 ? { increment: 1 } : { increment: 0 },
                totalMonth8: month === 8 ? { increment: 1 } : { increment: 0 },
                totalMonth9: month === 9 ? { increment: 1 } : { increment: 0 },
                totalMonth10: month === 10 ? { increment: 1 } : { increment: 0 },
                totalMonth11: month === 11 ? { increment: 1 } : { increment: 0 },
                totalMonth12: month === 12 ? { increment: 1 } : { increment: 0 },
            },
            where: { id }
        });

    }

    private async customCreateMonth(day: number) {
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

    private async customUpdateMonth(day: number, id: string) {
        const month = this.getMonth();
        // const dayNow = this.getDay();

        await this.prisma.staticticsForMonth.update({
            data: {
                monthName: month.label,
                monthNumber: month.id,
                year: this.getYear(),
                totalDay1: day === 1 ? { increment: 1 } : { increment: 0 },
                totalDay2: day === 2 ? { increment: 1 } : { increment: 0 },
                totalDay3: day === 3 ? { increment: 1 } : { increment: 0 },
                totalDay4: day === 4 ? { increment: 1 } : { increment: 0 },
                totalDay5: day === 5 ? { increment: 1 } : { increment: 0 },
                totalDay6: day === 6 ? { increment: 1 } : { increment: 0 },
                totalDay7: day === 7 ? { increment: 1 } : { increment: 0 },
                totalDay8: day === 8 ? { increment: 1 } : { increment: 0 },
                totalDay9: day === 9 ? { increment: 1 } : { increment: 0 },
                totalDay10: day === 10 ? { increment: 1 } : { increment: 0 },
                totalDay11: day === 11 ? { increment: 1 } : { increment: 0 },
                totalDay12: day === 12 ? { increment: 1 } : { increment: 0 },
                totalDay13: day === 13 ? { increment: 1 } : { increment: 0 },
                totalDay14: day === 14 ? { increment: 1 } : { increment: 0 },
                totalDay15: day === 15 ? { increment: 1 } : { increment: 0 },
                totalDay16: day === 16 ? { increment: 1 } : { increment: 0 },
                totalDay17: day === 17 ? { increment: 1 } : { increment: 0 },
                totalDay18: day === 18 ? { increment: 1 } : { increment: 0 },
                totalDay19: day === 19 ? { increment: 1 } : { increment: 0 },
                totalDay20: day === 20 ? { increment: 1 } : { increment: 0 },
                totalDay21: day === 21 ? { increment: 1 } : { increment: 0 },
                totalDay22: day === 22 ? { increment: 1 } : { increment: 0 },
                totalDay23: day === 23 ? { increment: 1 } : { increment: 0 },
                totalDay24: day === 24 ? { increment: 1 } : { increment: 0 },
                totalDay25: day === 25 ? { increment: 1 } : { increment: 0 },
                totalDay26: day === 26 ? { increment: 1 } : { increment: 0 },
                totalDay27: day === 27 ? { increment: 1 } : { increment: 0 },
                totalDay28: day === 28 ? { increment: 1 } : { increment: 0 },
                totalDay29: day === 29 ? { increment: 1 } : { increment: 0 },
                totalDay30: day === 30 ? { increment: 1 } : { increment: 0 },
                totalDay31: day === 31 ? { increment: 1 } : { increment: 0 },
            },
            where: { id }
        });

    }

    private getDate() {
        return `${this.date.getDate()}-${this.date.getMonth()}-${this.date.getFullYear()}`;
    }

    private getDay() {
        return this.date.getDate();
    }

    private getMonth() {
        const mth = this.date.getMonth() + 1;

        let label = `Enero`;
        if (mth === 1) label = `Enero`
        else if (mth === 2) label = `Febrero`
        else if (mth === 3) label = `Marzo`
        else if (mth === 4) label = `Abril`
        else if (mth === 5) label = `Mayo`
        else if (mth === 6) label = `Junio`
        else if (mth === 7) label = `Julio`
        else if (mth === 8) label = `Agosto`
        else if (mth === 9) label = `Septiembre`
        else if (mth === 10) label = `Octubre`
        else if (mth === 11) label = `Noviembre`
        else if (mth === 12) label = `Diciembre`
        else label = `Enero`;

        return {
            id: mth,
            label
        };
    }

    private getYear() {
        return this.date.getFullYear();
    }

    private getAllMonth() {
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

    private async getAllYear() {
        const years = this.prisma.staticticsForYear.groupBy({
            by: 'year',
            orderBy: { year: 'desc' }
        })
        return await years;
    }

    public getHeaderDay() {
        return [
            `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`,
            `11`, `12`, `13`, `14`, `15`, `16`, `17`, `18`, `19`, `20`,
            `21`, `22`, `23`, `24`, `25`, `26`, `27`, `28`, `29`, `30`,
            `31`
        ]
    }

    public getHeaderMonth() {
        return [`EN`, `FE`, `MA`, `AB`, `MA`, `JU`, `JU`, `AG`, `SE`, `OC`, `NO`, `DI`]
    }

    public async getHeaderYearUser() {
        const years = await this.getAllYear();
        const list = [];
        years.forEach((y) => {
            list.push(({ id: y.year, label: y.year }));
        })
        return list;
    }

    public async getHeaderCenturyUser() {
        const list = await this.prisma.staticticsUserForCentury.groupBy({
            by: 'year',
            orderBy: { year: 'desc' }
        });
        const lists = [];
        list.forEach((y) => {
            lists.push(y.year);
        })
        return lists;

    }

    public async fitlerMonthUser() {
        return this.getAllMonth()
    }

    public async filterYearUser() {
        return await this.getHeaderYearUser()
    }

    public async getHeaderYearProject() {
        const years = await this.getAllYear();
        const list: any = [];
        years.forEach((y) => {
            list.push({ id: y.year, label: y.year });
        })
        return list;
    }

    public async getHeaderCenturyProject() {
        const list = await this.prisma.staticticsProjectForCentury.groupBy({
            by: 'year',
            orderBy: { year: 'desc' }
        });
        const lists = [];
        list.forEach((y) => {
            lists.push(y.year);
        })
        return lists;

    }

    public async fitlerMonthProject() {
        return this.getAllMonth();
    }

    public async filterYearProject() {
        return await this.getHeaderYearProject();
    }
}
