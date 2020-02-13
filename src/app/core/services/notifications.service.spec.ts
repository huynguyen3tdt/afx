import { TestBed } from '@angular/core/testing';

import { NotificationsService } from './notifications.service';
import { EnvConfigService } from './env-config.service';
import { APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

const appEnvInitializerFn = (envConfig: EnvConfigService) => {
  return () => {
    return envConfig.loadEnvConfig();
  };
};

describe('NotificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [
      EnvConfigService,
      {
        provide: APP_INITIALIZER,
        useFactory: appEnvInitializerFn,
        multi: true,
        deps: [EnvConfigService]
      }]
  }));

  it('should be created', () => {
    const service: NotificationsService = TestBed.get(NotificationsService);
    expect(service).toBeTruthy();
  });
});
