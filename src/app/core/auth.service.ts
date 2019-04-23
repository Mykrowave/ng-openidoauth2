import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserManager, UserManagerSettings, User, WebStorageStateStore } from 'oidc-client';
import { Constants } from '../constants';


// TODO: Try PopUp direct url
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userManager: UserManager;
  private _user: User;

  constructor(private http: HttpClient) {
    const config: UserManagerSettings = {
      authority: Constants.stsAuthority,
      client_id: 'spa-client',
      redirect_uri: `${Constants.clientRoot}/assets/oidc-login-redirect.html`,
      response_type: 'id_token token',
      scope: 'openid projects-api profile',
      post_logout_redirect_uri: `${Constants.clientRoot}`,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      automaticSilentRenew: true,
      silent_redirect_uri: `${Constants.clientRoot}/assets/oidc-silent-redirect.html`
    };

    this._userManager = new UserManager(config);

    this._userManager.getUser().then(user => {
      if (user && !user.expired) {
        this._user = user;
      }
    });

    this._userManager.events.addUserLoaded(() => {
      this._userManager.getUser().then(user => this._user = user);
    } );


  }

  login(): Promise<any> {
    return this._userManager.signinRedirect();
  }
  logout(): Promise<any> {

    return this._userManager.signoutRedirect();
  }

  isAuthenticated(): boolean {
    return (this._user && this._user.access_token && !this._user.expired);
  }

  getAccessToken(): string {
    return this._user ? this._user.access_token : '';
  }

}
