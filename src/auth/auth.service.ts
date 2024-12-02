import { Injectable } from '@nestjs/common';
import { LanguajeService } from 'src/languaje/languaje.service';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';
import { Prisma, user } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { AuthLogin, AuthRegister } from './guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import AppPermit from 'src/permit/module/app.permit';
import { PermitService } from 'src/permit/permit.service';
import { UserCreate } from 'src/user/guards/user.guard';


@Injectable()
export default class AuthService {

    private lang: LanguajeInterface

    constructor (
        private userService: UserService,
        private languajeService: LanguajeService,
        private jwt: JwtService,
        private permitApp: AppPermit,
        private permit: PermitService
    ) {
        this.lang = this.languajeService.GetTranslate();
    }    

    /**
     * LOGIN
     * 
     */
    public async login ({ data }: { data:AuthLogin }) {
        try {

            const userFoundPromise = await this.userService.find({ filter:{email:data.param} }); 
            const userFound = userFoundPromise.body as user;

            const tokenPromise = this.jwt.signAsync({ id:userFound.id }, { privateKey:`api` });

            if(!userFound) {
                return {
                    message: this.lang.ACTIONS.DANGER.LOGIN,
                    error: true,
                    errorMessage: `email.not.found`,
                    body: []
                }
            }

            const compare = await this.userService.comparePassword({ password:data.password, passwordDb:userFound.password })
            if(!compare) {
                return {
                    message: this.lang.ACTIONS.DANGER.LOGIN,
                    error: true,
                    errorMessage: `password.not.match`,
                    body: []
                }
            }

            userFound.token = await tokenPromise;

            const entity = {
                user: userFound,
                token: await tokenPromise
            }

            await this.userService.udpate({ id:userFound.id, data:{token:entity.token} })

            // FIN
            return {
                message: this.lang.ACTIONS.SUCCESS.LOGIN,
                error: false,
                body: entity
            };
        } catch (error) {
            // log
            // log error
            return {
                message: this.lang.ACTIONS.DANGER.LOGIN,
                error: true,
                errorMessage: error.message,
                body: {}
            };
        }
    }

    /**
     * REGISTRO
     * 
     */
    public async register ({ data }: { data:AuthRegister }) {
        try {
            const emailFoundPromise = this.userService.find({ filter:{ email:data.email } });
            const usernameFoundPromise = this.userService.find({ filter:{ username:data.username } });
            const permitFound = this.permit.find({ filter:{ name:this.permitApp.ESTUDIANTE } });

            const emailFound = (await emailFoundPromise).body; 
            const usernameFound = (await usernameFoundPromise).body; 
            const permitStudent = (await permitFound).body; 

            if(emailFound) {
                return {
                    message: this.lang.ACTIONS.DANGER.VALIDATIONS.EMAIL_IN_USE,
                    error: true,
                    errorMessage: `email.in.use`,
                    body: null
                }
            }

            if(usernameFound) {
                return {
                    message: this.lang.ACTIONS.DANGER.VALIDATIONS.USERNAME_IN_USE,
                    error: true,
                    errorMessage: `username.in.use`,
                    body: null
                }
            }

            const createUser: UserCreate = {
                email: data.email,
                lastname: data.lastname,
                name: data.name,
                password: data.password,
                username: data.username,
                rolId: permitStudent.id,
                token: ``,
                ci: data.ci
            }

            const userResult = await this.userService.create({ data:createUser });

            // FIN
            return {
                message: this.lang.ACTIONS.SUCCESS.REGISTER,
                error: false,
                body: userResult
            };
        } catch (error) {
            // log
            // log error
            return {
                message: this.lang.ACTIONS.DANGER.REGISTER,
                error: true,
                errorMessage: error.message,
                body: null
            };
        }
    }
}
