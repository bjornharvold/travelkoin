/*
 * Copyright (c) 2018. Traveliko PTE.LTD. All rights Reserved.
 */


import {from as observableFrom, Observable} from 'rxjs';
import {TranslateLoader} from '@ngx-translate/core';

export class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return observableFrom(System.import(`../assets/i18n/${lang}.json`));
  }
}
