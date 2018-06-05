/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {AuthenticationTokenService} from './authentication-token.service';

const AUTHENTICATION_ENDPOINT = '/api/authenticate';

@Injectable({providedIn: 'root'})
export class AuthenticationHttpInterceptorService implements HttpInterceptor {

  private isApiUrl(url): boolean {
    return url.includes(environment.restBaseUrl);
  }

  /**
   * - Will set an auth token in the header, if it is valid, and send it to the server.
   * - Will also save an auth token if it finds one in the response.
   * - Will remove the auth token if it receives a 401 status code
   * @param req
   * @param next
   * @returns {Observable<T>}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.isApiUrl(req.url)) {
      return next.handle(req);
    }
    let request: Observable<HttpEvent<any>>;

    // here is what we add to the header
    if (this.authenticationTokenService.isTokenValid()) {
      const token = this.authenticationTokenService.authenticationToken;
      // update token client side
      this.authenticationTokenService.authenticationToken = token;

      // add headers
      const authReq = req.clone({headers: req.headers.set(environment.authTokenName, token)});
      request = next.handle(authReq);
    } else {
      request = next.handle(req);
    }

    // this is the response below that we can intercept and do something with
      return request.pipe(
          tap(event => {
              if (event instanceof HttpResponse) {
                  const response: HttpResponse<Object> = <HttpResponse<Object>>event;
                  const authToken: string = response.headers.get(environment.authTokenName);
                  if (authToken != null) {
                      this.authenticationTokenService.authenticationToken = authToken;
                  }
              } else if (event instanceof HttpErrorResponse) {
                  const response: HttpErrorResponse = <HttpErrorResponse>event;
                  const url = response.url;
                  if ((response.status === 401 || response.status === 403) && !url.endsWith(AUTHENTICATION_ENDPOINT)) {
                      // our auth token is either non-existent or it has been invalidated on the server side
                      // in any case we will remove it
                      this.authenticationTokenService.clearAuthenticationToken();
                  }
              }
          })
      )
  }

  constructor(private authenticationTokenService: AuthenticationTokenService) {
  }

}
