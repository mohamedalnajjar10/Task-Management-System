import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    _: string, // Unused refreshToken
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    const user = {
      id: profile.id,
      email: profile.emails[0]?.value,
      name: profile.displayName,
      picture: profile.photos[0]?.value,
      accessToken,
    };
    done(null, user);
  }
}
