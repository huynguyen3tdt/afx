import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { EnvConfigService } from 'src/app/core/services/env-config.service';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from 'src/app/core/intercept/error.intercepter';
import { AppHttpInterceptor } from 'src/app/core/intercept/app.interceptor';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



const appEnvInitializerFn = (envConfig: EnvConfigService) => {
  return () => {
    return envConfig.loadEnvConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    EnvConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appEnvInitializerFn,
      multi: true,
      deps: [EnvConfigService]
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
