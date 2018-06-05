/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

const TIMEZONE_OFFSET = 'TimeZone-Offset';

@Injectable({providedIn: 'root'})
export class TimezoneOffsetHttpInterceptorService implements HttpInterceptor {

  private isApiUrl(url): boolean {
    return url.includes(environment.restBaseUrl);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.isApiUrl(req.url)) {
      return next.handle(req);
    }

    // Clone the request to add the new header.
    const timezoneOffsetAddedReq = req.clone({headers: req.headers.set(TIMEZONE_OFFSET, String(new Date().getTimezoneOffset()))});

    // Pass on the cloned request instead of the original request.
    return next.handle(timezoneOffsetAddedReq);
  }

  constructor() {
  }

}
