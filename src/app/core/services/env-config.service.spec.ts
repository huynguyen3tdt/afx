import { TestBed } from '@angular/core/testing';

import { EnvConfigService } from './env-config.service';

describe('EnvConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnvConfigService = TestBed.get(EnvConfigService);
    expect(service).toBeTruthy();
  });
});
