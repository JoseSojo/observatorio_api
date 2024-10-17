import { Injectable } from "@nestjs/common";
import { currentSuperAdmin, currentAdmin } from "src/Factory/PermitsFactory";
import { ConfigCityModel } from "src/Model/M/Master/CityModel";
import { CoinModel } from "src/Model/M/Master/CoinModel";
import { ConfigCountryModel } from "src/Model/M/Master/CountryModel";
import { PaymentMethodModel } from "src/Model/M/Master/PaymentMethodModel";
import { ConfigStateModel } from "src/Model/M/Master/StateModel";
import { PermitsModel } from "src/Model/M/Permits/PermitsModel";
import { UserModel } from "src/Model/M/User/UserModel";
import { CityService } from "src/Service/Master/CityService";
import { CoinService } from "src/Service/Master/CoinService";
import { ConfigCountryService } from "src/Service/Master/CountryService";
import { PaymentMethodService } from "src/Service/Master/PaymentMethodService";
import { StateService } from "src/Service/Master/StateService";
import { UserService } from "src/Service/User/UserService";

const dataPermit = {
    name: `SUPER_ADMIN`,
    roles: currentSuperAdmin
}

const dataPermitAdmin = {
    name: `ADMIN`,
    roles: currentAdmin
}

const dataUser = {
    email: `superadmin@example.com`,
    password: `12345678`,
    username: `superadmin`,

}

@Injectable()
export class StartFixtures {

    constructor(
        private user: UserService,
        private userModel: UserModel,
        private permit: PermitsModel,
        private country: ConfigCountryService,
        private state: StateService,
        private city: CityService,
        private coin: CoinService,
        private payment: PaymentMethodService
    ) { }

    public async run() {
        const rolFound = await this.permit.findBy({ filter: [{ name: `SUPER_ADMIN` }] });
        const userFound = await this.userModel.findBy({ filter: [{ username: `superadmin` }, { username: `superadmin@example.com` }] });
        const country = await this.country.FindAllConfigCountry({ filter: [{ name: `VENEZUELA` }], skip:0,take:1 });
        const state1 = await this.state.FindAllConfigState({ filter: [{ name: `GUARICO` }], skip:0,take:1 });
        const state2 = await this.state.FindAllConfigState({ filter: [{ name: `ARAGUA` }], skip:0,take:1 });
        const state3 = await this.state.FindAllConfigState({ filter: [{ name: `CARABOBO` }], skip:0,take:1 });
        const city1 = await this.city.FindAllConfigCity({ filter: [{ name: `SAN JUAN DE LOS MORROS` }], skip:0,take:1 });
        const city2 = await this.city.FindAllConfigCity({ filter: [{ name: `Maracay` }], skip:0,take:1 });
        const city3 = await this.city.FindAllConfigCity({ filter: [{ name: `VALENCIA` }], skip:0,take:1 });
        const coin1 = await this.coin.FindAllCoin({ filter: [{ name: `BOLIVAR` }], skip:0,take:1 });
        const coin2 = await this.coin.FindAllCoin({ filter: [{ name: `DOLAR` }], skip:0,take:1 });
        const coin3 = await this.coin.FindAllCoin({ filter: [{ name: `USDT` }], skip:0,take:1 });

        if (rolFound) return `rol ya creado`;
        if (userFound) return `usuario ya creado`;
        if (country.body.country) return `country ya creado`;
        if (state1.body.state) return `state ya creado`;
        if (state2.body.state) return `state ya creado`;
        if (state3.body.state) return `state ya creado`;
        if (city1.body.city) return `city ya creado`;
        if (city2.body.city) return `city ya creado`;
        if (city3.body.city) return `city ya creado`;
        if (coin1.body.coin) return `city ya creado`;
        if (coin2.body.coin) return `city ya creado`;
        if (coin3.body.coin) return `city ya creado`;

        const superadmin = await this.permit.create(dataPermit);
        const admin = await this.permit.create(dataPermitAdmin);

        const usersuperadmin = await this.user.CreateNewUser({
            ...dataUser,
            rolReference: {
                connect: {
                    id: superadmin.id
                }
            }
        });

        const useradmin = await this.user.CreateNewUser({
            email: `admin@example.com`,
            password: `12345678`,
            username: `admin`,
            rolReference: {
                connect: {
                    id: admin.id
                }
            }
        });
        const useradmin1 = await this.user.CreateNewUser({
            email: `admin1@example.com`,
            password: `12345678`,
            username: `admin1`,
            rolReference: {
                connect: {
                    id: admin.id
                }
            }
        });

        await this.permit.update({
            id: superadmin.id, data: {
                createByReference: {
                    connect: { id: usersuperadmin.body.user.id }
                }
            }
        });
        await this.permit.update({
            id: admin.id, data: {
                createByReference: {
                    connect: { id: usersuperadmin.body.user.id }
                }
            }
        });

        const bolivar = await this.coin.CreateCoin({ createByReference: { connect: { id: usersuperadmin.body.user.id } }, name: `Bolivar`, description: `Moneda venezolana`, prefix: `bs` });
        const dolar = await this.coin.CreateCoin({ createByReference: { connect: { id: usersuperadmin.body.user.id } }, name: `dolar`, description: `Moneda americana`, prefix: `$`, } );
        const usdt = await this.coin.CreateCoin({ createByReference: { connect: { id: usersuperadmin.body.user.id } }, name: `usdt`, description: `monera dolar virtual`, prefix: `usdt`, } );

        const vzla = await this.country.CreateCountry({ createByReference: { connect: { id: usersuperadmin.body.user.id } }, name: `VEnezuela`, coinReference: { connect: { id: bolivar.body.coin.id } }, prefixPhone: `58` } );
        const gua = await this.state.CreateState({ createByReference: { connect: { id: usersuperadmin.body.user.id } }, countryReference: { connect: { id: vzla.body.country.id } }, name: `Guarico` } );
        const arg = await this.state.CreateState({ createByReference: { connect: { id: usersuperadmin.body.user.id } }, countryReference: { connect: { id: vzla.body.country.id } }, name: `Aragua` } );
        const crb = await this.state.CreateState({ createByReference: { connect: { id: usersuperadmin.body.user.id } }, countryReference: { connect: { id: vzla.body.country.id } }, name: `Valencia` } );
        const sjm = await this.city.CreateCity({ createByReference: { connect: { id: usersuperadmin.body.user.id } }, stateReference: { connect: { id: gua.body.state.id } }, name: `San juan de los morros` } );
        const mrc = await this.city.CreateCity({ createByReference: { connect: { id: usersuperadmin.body.user.id } }, stateReference: { connect: { id: gua.body.state.id } }, name: `Maracay` } );
        const vln = await this.city.CreateCity({ createByReference: { connect: { id: usersuperadmin.body.user.id } }, stateReference: { connect: { id: gua.body.state.id } }, name: `valenciA` } );

        const binance = await this.payment.CreatePaymentMethod({ createByReference: { connect: { id: usersuperadmin.body.user.id } },moneyReference:{connect:{id:usdt.body.coin.id}}, name:`Binance`, description:`Cuenta en bitcoin`  });
        const divisa = await this.payment.CreatePaymentMethod({ createByReference: { connect: { id: usersuperadmin.body.user.id } },moneyReference:{connect:{id:dolar.body.coin.id}}, name:`Divisa`, description:`Pago en divisa (dolares)`  });
        const paymobil = await this.payment.CreatePaymentMethod({ createByReference: { connect: { id: usersuperadmin.body.user.id } },moneyReference:{connect:{id:bolivar.body.coin.id}}, name:`Pagomovil`, description:`Pago a la cuenta bancaria`  });
        const efectivo = await this.payment.CreatePaymentMethod({ createByReference: { connect: { id: usersuperadmin.body.user.id } },moneyReference:{connect:{id:bolivar.body.coin.id}}, name:`Efectivo`, description:`Pago en bolivares en efectivo`  });

        // await this.userModel.update({ id:superadmin.id, cityReference:{ connect:{id:sjm.id} } } });

        return {
            rol: [superadmin.name, admin.name],
            user: [
                usersuperadmin.body.user.username,
                useradmin.body.user.username,
                useradmin1.body.user.username
            ],
            moneda: [
                dolar.body,
                bolivar.body
            ],
            payment: [
                binance.body,
                divisa.body,
                paymobil.body,
                efectivo.body
            ],
            country: vzla.body,
            state: [gua.body, arg.body, crb.body],
            city: [sjm.body, mrc.body, vln.body]
        };
    }

}
