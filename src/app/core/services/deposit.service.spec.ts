import { TestBed } from '@angular/core/testing';

import { DepositService } from './deposit.service';
import { HttpClientModule } from '@angular/common/http';


describe('DepositService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
  }));

  it('should be created', () => {
    const service: DepositService = TestBed.get(DepositService);
    expect(service).toBeTruthy();
  });
});
