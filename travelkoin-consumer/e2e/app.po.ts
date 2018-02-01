/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {browser, by, element} from 'protractor';

export class TttPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
