/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {EventEmitter, Injectable, Output} from '@angular/core';
import {AuthenticationToken} from '../model/authentication-token';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthenticationTokenService {
  private _authenticationToken: AuthenticationToken = null;
  @Output() authenticationTokenExpiredEvent: EventEmitter<any>;

  set authenticationToken(token: string) {
    this._authenticationToken = new AuthenticationToken(token);

    const toStore = JSON.stringify(this._authenticationToken);

    localStorage.setItem(environment.authTokenName, toStore);
  }

  // returns null if token either doesn't exist or has expired
  get authenticationToken(): string {
    let result: string = null;

    if (this._authenticationToken != null && this._authenticationToken.isAuthTokenValid()) {
      result = this._authenticationToken.token;
    } else {
      const json = localStorage.getItem(environment.authTokenName);
      if (json != null) {
        const obj: any = JSON.parse(json);
        const token: AuthenticationToken = AuthenticationToken.deserializeObject(obj);
        if (token.isAuthTokenValid()) {

          result = token.token;
        }
      }
    }

    return result;
  }

  clearAuthenticationToken(): void {
    this._authenticationToken = null;
    localStorage.removeItem(environment.authTokenName);
    this.authenticationTokenExpiredEvent.emit({});
  }

  isTokenValid(): boolean {
    return this.authenticationToken != null;
  }

  constructor() {
    this.authenticationTokenExpiredEvent = new EventEmitter(true);
  }

}
