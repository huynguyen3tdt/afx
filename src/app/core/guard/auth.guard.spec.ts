import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard,
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); }}],
      imports : []
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
