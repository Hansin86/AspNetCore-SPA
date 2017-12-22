import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(protected auth: AuthService) { }

  canActivate() {
    if(this.auth.isAuthenticated())
      return true;

    this.auth.login();
    return false;
  }
}
