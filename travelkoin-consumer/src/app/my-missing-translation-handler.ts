import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';

export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    console.warn(`|${params.key}| could not be found in the default or current language pack`);
    return `Could not translate: ${params.key}`;
  }
}
