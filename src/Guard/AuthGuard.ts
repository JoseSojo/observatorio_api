import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { jwtConstants } from '../constant';
  import { Request } from 'express';
import { UserModel } from 'src/Model/M/User/UserModel';
import { SessionModel } from 'src/Model/M/User/SessionModel';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService, 
      private user: UserModel,
      private session: SessionModel
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      
      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.session.findBy({ filter:[{token}] });
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        const user = await this.user.findBy({ filter:[{id:payload.userId}] });
        if(!user) throw new UnauthorizedException();

        request['user'] = user;
      } catch {
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }