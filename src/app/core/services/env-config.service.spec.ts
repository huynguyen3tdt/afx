import { TestBed } from '@angular/core/testing';

import { EnvConfigService } from './env-config.service';
import { HttpClientModule } from '@angular/common/http';

describe('EnvConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: EnvConfigService = TestBed.get(EnvConfigService);
    expect(service).toBeTruthy();
  });
});
