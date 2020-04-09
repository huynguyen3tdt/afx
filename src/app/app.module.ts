import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ModuleWithProviders } from '@angular/core';

import { AppComponent } from './app.component';
import { EnvConfigService } from 'src/app/core/services/env-config.service';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from 'src/app/core/intercept/error.intercepter';
import { AppHttpInterceptor } from 'src/app/core/intercept/app.interceptor';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { RegisterLayoutComponent } from './register/register-layout.component';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { AppRoutes } from './app.routing';
import { ManageLayoutComponent } from './manage/manage-layout.component';
import { HeaderComponent } from './manage/header/header.component';
import { FooterComponent } from './manage/footer/footer.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginGuard } from './core/guard/login.guard';
import { AuthGuard } from './core/guard/auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

const appEnvInitializerFn = (envConfig: EnvConfigService) => {
  return () => {
    return envConfig.loadEnvConfig();
  };
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

const Routing: ModuleWithProviders = RouterModule.forRoot(AppRoutes, {
  preloadingStrategy: PreloadAllModules
});

@NgModule({
  declarations: [
    AppComponent,
    RegisterLayoutComponent,
    ManageLayoutComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    Routing,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    EnvConfigService,
    AuthGuard,
    LoginGuard,
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
