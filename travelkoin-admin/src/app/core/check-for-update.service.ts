/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SwUpdate} from '@angular/service-worker';
import 'rxjs/add/observable/interval';

@Injectable()
export class CheckForUpdateService {

  constructor(updates: SwUpdate) {
    Observable.interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate());
  }

}
