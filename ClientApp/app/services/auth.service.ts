import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthService {
  profile: any;
  private roles: string[] = [];

  private authOptions: auth0.AuthOptions = {
    clientID: 't15165MNvK5HJ7b8K7Uxo91KFTfZp6bN',
    domain: 'aspnetcorespaudemy.eu.auth0.com',
    responseType: 'token id_token',
    audience: 'https://api.aspcorespa.com', //'https://aspnetcorespaudemy.eu.auth0.com/userinfo',
    redirectUri: 'http://localhost:5000/callback',      
    scope: 'openid email profile'
  };

  auth0 = new auth0.WebAuth(this.authOptions);

  constructor(public router: Router) {
    this.readUserFromLocalStorage();
  }

  private readUserFromLocalStorage() {
    this.profile = JSON.parse(localStorage.getItem('profile') || '{}');

    var token = localStorage.getItem('token');
    if(token) {
      var jwtHelper: any = new JwtHelper();
      var decodedToken = jwtHelper.decodeToken(token);
      this.roles = decodedToken['https://aspcorespa.core/roles'] || [];
    }
  }

  public isInRole(roleName: any) {
    return this.roles.indexOf(roleName) > -1;
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      console.log("authResult", authResult);
      if (authResult && authResult.accessToken && authResult.idToken) {        
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/vehicles']);
      } else if (err) {
        this.router.navigate(['/vehicles']);
        console.log(err);
      }
    });
  }

  private setSession(authResult: any): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    this.auth0.client.userInfo(authResult.accessToken, (error, profile) => {
      if(error)
        throw error;

      localStorage.setItem('profile', JSON.stringify(profile));

      this.readUserFromLocalStorage();
    });
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
    this.profile = null;
    this.roles = [];
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }

}