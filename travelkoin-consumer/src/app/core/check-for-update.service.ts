/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */


import {interval as observableInterval, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';


@Injectable({providedIn: 'root'})
export class CheckForUpdateService {

  constructor(updates: SwUpdate) {
    observableInterval(6 * 60 * 60).subscribe(() => updates.checkForUpdate());
  }

}
