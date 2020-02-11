import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { EnvConfig } from '../model/env-config';

@Injectable({
  providedIn: 'root'
})
export class EnvConfigService {
  envConfig: EnvConfig;
  envConfigNull: EnvConfig = null;

  constructor(private http: HttpClient) { }

  loadEnvConfig() {
    if (isNullOrUndefined(this.envConfig)) {
      return this.http.get<EnvConfig>('/assets/env_prod.json')
        .toPromise<EnvConfig>()
        .then(data => {
          this.envConfig = data;
        });
      }
    return Promise.resolve(this.envConfigNull);
  }

  getConfig() {
    if (this.envConfig) {
      return this.envConfig.backEnd;
    }
  }
}
