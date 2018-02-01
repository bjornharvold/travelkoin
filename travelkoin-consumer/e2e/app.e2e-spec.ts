/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {TttPage} from './app.po';

describe('ttt App', () => {
  let page: TttPage;

  beforeEach(() => {
    page = new TttPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
