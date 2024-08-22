import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/jw-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class GuardGuard implements CanActivate {

  constructor( private jwtService:JwtService, private authservice:AuthService){}
  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean>  {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token){
      throw new UnauthorizedException('no hay token en la peticion')
    }

    try{
    const payload = await this.jwtService.verifyAsync<JwtPayload>(
      token,
      {
        secret: process.env.JWT_SEED
      }
    )

    const user = await this.authservice.findUserById(payload.id)
    if(!user) throw new UnauthorizedException('user does not exist')
    if(!user.isActive) throw new UnauthorizedException('user is not active')
    request['user'] = user;
    
    ;} catch(error){

      throw new UnauthorizedException()

    }
    // 💡 We're assigning the payload to the request object here
    // so that we can access it in our route handlers
   
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
