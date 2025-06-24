import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, ResetPasswordDto, SingInDto, SingUpDto } from './dto/auth.dto';
// import { AuthGuard } from 'src/guards/auth.guard';
// import { Roles } from 'src/decorator/Roles-decorator';
// import { RolesGuard } from 'src/guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles('admin')
  async signup(@Body() singupDto: SingUpDto) {
    return this.authService.singup(singupDto);
  }

  @Post('login')
  async login(@Body() singinDto: SingInDto) {
    return this.authService.login(singinDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('verify-code')
  async verifyCode(@Body() verfiyCode: { email: string; code: string }) {
    const { email, code } = verfiyCode;
    return this.authService.verifyResetCode(email, code);
  }

  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

}
