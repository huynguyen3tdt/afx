import { TestBed } from '@angular/core/testing';

import { AuthenService } from './authen.service';
import { HttpClientModule } from '@angular/common/http';
import { EnvConfigService } from './env-config.service';
import { LoginResponseModel } from './../model/login-response.model';
import { APP_INITIALIZER } from '@angular/core';

const appEnvInitializerFn = (envConfig: EnvConfigService) => {
  return () => {
    return envConfig.loadEnvConfig();
  };
};

describe('AuthenService', () => {
  let service: AuthenService;
  let envConfigService: EnvConfigService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        EnvConfigService,
        AuthenService,
        {
          provide: APP_INITIALIZER,
          useFactory: appEnvInitializerFn,
          multi: true,
          deps: [EnvConfigService]
        }]
    });
    service = TestBed.get(AuthenService);
    envConfigService = TestBed.get(EnvConfigService);
  });

  it('should be created', () => {
    const serviceAnth: AuthenService = TestBed.get(AuthenService);
    expect(serviceAnth).toBeTruthy();
  });

  // it('login() should return value from observable',
  //   () => {
  //   const param = {
  //     login_id: 1001,
  //     password: 12345678,
  //     device_type: 'android'
  //   };
  //   envConfigService.loadEnvConfig();
  //   service.login(param).subscribe((response: LoginResponseModel) => {
  //     console.log('responseeeeeee ', response);
  //   });
  // });
});
