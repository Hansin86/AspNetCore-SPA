import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AdminAuthGuardService extends AuthGuardService {

  constructor(auth: AuthService) {
    super(auth);
   }
  
    canActivate() {
      var isAuthenticated = super.canActivate();

      return isAuthenticated ? this.auth.isInRole('Admin') : false;
    }

}
