/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable()
export class ServerHeartBeatService {
  private serverAvailable = true;
  @Output() serverAvailableEvent: EventEmitter<any>;

  updateServerAvailability(available: boolean) {
    this.serverAvailable = available;
    this.serverAvailableEvent.emit(available);
  }

  constructor() {
    this.serverAvailableEvent = new EventEmitter(true);
  }

}
