/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ServerHeartBeatService} from './server-heart-beat.service';
import {environment} from '../../environments/environment';
import {tap} from 'rxjs/operators';

@Injectable()
export class ServerErrorHttpInterceptorService implements HttpInterceptor {

    private isApiUrl(url): boolean {
        return url.includes(environment.restBaseUrl);
    }

    /**
     * This interceptor will track server availability
     * @param req
     * @param next
     * @returns {Observable<T>}
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!this.isApiUrl(req.url)) {
            return next.handle(req);
        }

        return next.handle(req).pipe(
            tap(event => {
                    if (event instanceof HttpResponse) {
                        this.serverHeartBeatService.updateServerAvailability(true);
                    } else if (event instanceof HttpErrorResponse) {
                        const response: HttpErrorResponse = <HttpErrorResponse>event;

                        if (response.ok === false && response.status === 500) {
                            // Server is down
                            this.serverHeartBeatService.updateServerAvailability(false);
                        }
                    }
                },
                error => {
                    if (error instanceof HttpErrorResponse) {
                        const response: HttpErrorResponse = <HttpErrorResponse>error;

                        if (response.ok === false && response.status === 500) {
                            // Server is down
                            this.serverHeartBeatService.updateServerAvailability(false);
                        }
                    }
                }
            )
        )
    }

    constructor(private serverHeartBeatService: ServerHeartBeatService) {
    }

}
