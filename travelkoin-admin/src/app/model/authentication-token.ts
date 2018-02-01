/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {environment} from '../../environments/environment';

export class AuthenticationToken {
  token: string;
  lastAccessed: number;

  static deserializeObject(obj: any): AuthenticationToken {
    const at: AuthenticationToken = new AuthenticationToken();
    if (obj.token !== null) {
      at.token = obj.token;
    }

    if (obj.lastAccessed !== null) {
      at.lastAccessed = obj.lastAccessed;
    }

    return at;
  }

  isAuthTokenValid(): boolean {
    let result = false;

    if (this.lastAccessed !== null && this.token !== null) {
      if (this.lastAccessed + (environment.authTokenExpiration * 1000) > Date.now()) {
        result = true;
      }
    }

    return result;
  }

  constructor(token?: string) {
    this.token = token;
    this.lastAccessed = Date.now();
  }
}
