import { TestBed, async, inject } from '@angular/core/testing';

import { HansGuard } from './hans.guard';

describe('HansGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HansGuard]
    });
  });

  it('should ...', inject([HansGuard], (guard: HansGuard) => {
    expect(guard).toBeTruthy();
  }));
});
