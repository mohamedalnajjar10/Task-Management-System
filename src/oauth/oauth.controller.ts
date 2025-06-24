import { Controller, Get, UseGuards, Req , Res, Post} from '@nestjs/common';
import { OauthService } from './oauth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';


@Controller('api/auth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) { }
  @Get('google/sign')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    return { message: 'Google authentication initiated' };
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any , @Res() res : Response) {
    try {
      const userObject = req.user;
      if (!userObject) {
        throw new Error('No user data received from Google');
      }

      const user = {
        userId: userObject.id || userObject.sub,
        email: userObject.email,
        name: userObject.name || userObject.displayName,
        picture: userObject.picture,
      };

      const result = await this.oauthService.validate(user);
      return result;
    } catch (error) {
      console.error('Google callback error:', error);
      throw error;
    }
  }
  
  @Post('callback/sign')
  async callbackSign(user: any) {
    return this.oauthService.validate(user);
  }
}
