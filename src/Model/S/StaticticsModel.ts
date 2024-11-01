import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Service/PrismaService";

@Injectable()
export class StaticticsModel {

    constructor (
        private prisma: PrismaService
    ) {}

    // `role.user` | `coin.payment` | `country.state` | `city.state` | `subscription.user`

    public async PieUserInPermit (): Promise<{label:string[],value:number[],title:string}> {
        const label: string[] = [];
        const value: number[] = [];
        const title = `Top permisos con más usuarios`;

        const result = await this.prisma.permits.findMany({
            where: { isDelete: false },
            select: {
                name: true,
                _count: true
            },
            skip: 0,
            take: 10,
            orderBy: {
                users: {
                    _count: "desc"
                }
            }
        });

        result.forEach((item) => {
            label.push(item.name);
            value.push(item._count.users);
        });

        return {label,value,title};
    }

    public async PieUserInCity (): Promise<{label:string[],value:number[],title:string}> {
        const label: string[] = [];
        const value: number[] = [];
        const title = `Top ciudades con más usuarios`;

        const result = await this.prisma.configCity.findMany({
            where: { isDelete: false },
            select: {
                name: true,
                _count: true
            },
            skip: 0,
            take: 10,
            orderBy: {
                users: { _count:"desc" }
            }
        });

        result.forEach((item) => {
            label.push(item.name);
            value.push(item._count.users);
        });

        return {label,value,title};
    }

    public async PieUserInSubscription (): Promise<{label:string[],value:number[],title:string}> {
        const label: string[] = [];
        const value: number[] = [];
        const title = `Top subscriptiones con más usuarios`;

        const result = await this.prisma.subscription.findMany({
            where: { isDelete: false },
            select: {
                name: true,
                _count: true,
            },
            skip: 0,
            take: 10,
            orderBy: {
                userReference: {
                    _count: "desc"
                }
            }
        });

        result.forEach((item) => {
            label.push(item.name);
            value.push(item._count.userReference);
        });

        return {label,value,title};
    }

    public async PieCoinInPayment (): Promise<{label:string[],value:number[],title:string}> {
        const label: string[] = [];
        const value: number[] = [];
        const title = `Top monedas en métodos de pago`;

        const result = await this.prisma.coin.findMany({
            where: { isDelete: false },
            select: {
                name: true,
                _count: true
            },
            skip: 0,
            take: 10,
            orderBy: {
                paymentMethods: {
                    _count: "desc"
                }
            }
        });

        result.forEach((item) => {
            label.push(item.name);
            value.push(item._count.paymentMethods);
        });

        return {label,value,title};
    }

    public async PieCityInState (): Promise<{label:string[],value:number[],title:string}> {
        const label: string[] = [];
        const value: number[] = [];
        const title = `Top estados con más ciudades`;


        const result = await this.prisma.configState.findMany({
            where: { isDelete: false },
            select: {
                name: true,
                _count: true
            },
            skip: 0,
            take: 10,
            orderBy: {
                citys: {
                    _count: "desc"
                }
            }
        });

        result.forEach((item) => {
            label.push(item.name);
            value.push(item._count.citys);
        });

        return {label,value,title};
    }

    public async PieStateInCountry (): Promise<{label:string[],value:number[],title:string}> {
        const label: string[] = [];
        const value: number[] = [];
        const title = `Top paises con más estados`;

        const result = await this.prisma.configCountry.findMany({
            where: { isDelete: false },
            select: {
                name: true,
                _count: true
            },
            skip: 0,
            take: 10,
            orderBy: {
                states: { _count:"desc" }
            }
        });

        result.forEach((item) => {
            label.push(item.name);
            value.push(item._count.states);
        });

        return {label,value,title};
    }
}
