/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  environment: string = environment.environment;
  year: number = moment().year();

  constructor() {
  }

  ngOnInit() {
  }

}
