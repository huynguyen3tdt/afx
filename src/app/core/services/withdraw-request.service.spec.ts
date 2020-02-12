import { TestBed } from '@angular/core/testing';

import { WithdrawRequestService } from './withdraw-request.service';
import { HttpClientModule } from '@angular/common/http';

describe('WithdrawRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
  }));

  it('should be created', () => {
    const service: WithdrawRequestService = TestBed.get(WithdrawRequestService);
    expect(service).toBeTruthy();
  });
});



