import { TestBed, async, inject } from '@angular/core/testing';

import { LoginGuard } from './login.guard';
import { Router } from '@angular/router';

describe('LoginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginGuard,
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); }}]
    });
  });

  it('should ...', inject([LoginGuard], (guard: LoginGuard) => {
    expect(guard).toBeTruthy();
  }));
});
