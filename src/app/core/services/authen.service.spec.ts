import { TestBed } from '@angular/core/testing';

import { AuthenService } from './authen.service';
import { HttpClientModule } from '@angular/common/http';
import { EnvConfigService } from './env-config.service';
import { LoginResponseModel } from './../model/login-response.model';
import { APP_INITIALIZER } from '@angular/core';
import { AuthenServiceMock } from '../mock/authen.service.mock';
import { ResponseWihtoutDataModel } from '../model/none-data-response.model';
import { MOCK_RESPONSE_WITHOUT_DATA } from '../mock/data/data-null.mock';
import { MOCK_LOGIN_RESPONSE } from '../mock/data/authen.mock';

const appEnvInitializerFn = (envConfig: EnvConfigService) => {
  return () => {
    return envConfig.loadEnvConfig();
  };
};

describe('AuthenService', () => {
  let service: AuthenService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        EnvConfigService,
        AuthenService,
        {provide: AuthenService, useClass: AuthenServiceMock},
        {
          provide: APP_INITIALIZER,
          useFactory: appEnvInitializerFn,
          multi: true,
          deps: [EnvConfigService]
        }]
    });
    service = TestBed.get(AuthenService);
  });

  it('should be created', () => {
    const serviceAnth: AuthenService = TestBed.get(AuthenService);
    expect(serviceAnth).toBeTruthy();
  });

  it('login() should return value from observable',
    () => {
    const param = {
      login_id: 1001,
      password: 12345678,
      device_type: 'android'
    };
    service.login(param).subscribe((response: LoginResponseModel) => {
      expect(response).toEqual(MOCK_LOGIN_RESPONSE);
    });
  });


  it('logout() should return value from observable',
    () => {
    service.logout().subscribe((response: ResponseWihtoutDataModel) => {
      expect(response).toEqual(MOCK_RESPONSE_WITHOUT_DATA);
    });
  });

  it('login() should return value from observable',
    () => {
    const param = {
      login_id: 'minhchau@tamdongtam.vn',
      dob: '2020-02-11T06:28:35.975Z'
    };
    service.forgotPassWord(param).subscribe((response: LoginResponseModel) => {
      expect(response).toEqual(MOCK_RESPONSE_WITHOUT_DATA);
    });
  });
});
