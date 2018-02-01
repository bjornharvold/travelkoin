/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';

@Injectable()
export class MediaTypeHttpInterceptorService implements HttpInterceptor {

  private isApiUrl(url): boolean {
    return url.includes(environment.restBaseUrl);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.isApiUrl(req.url)) {
      return next.handle(req);
    }

    // This will add the headers for to set the correct content type / versioning
    const mediaTypeReq = req.clone(
      {
        setHeaders: {
          'Accept': environment.version,
          'Content-Type': environment.version
        }
      });

    // Pass on the cloned request instead of the original request.
    return next.handle(mediaTypeReq);
  }

  constructor() {
  }

}
