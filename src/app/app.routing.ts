import { Routes } from '@angular/router';
import { RegisterLayoutComponent } from './register/register-layout.component';
import { ManageLayoutComponent } from './manage/manage-layout.component';

export const AppRoutes: Routes = [
    // {
    //     path: '',
    //     redirectTo: 'login',
    //     pathMatch: 'full',
    // },
    {
        path: '',
        component: RegisterLayoutComponent,
        children: [{
            path: '',
            loadChildren: './register/register.module#RegisterModule',
        },
        ]
    },
    {
        path: 'manage',
        component: ManageLayoutComponent,
        children: [{
            path: '',
            loadChildren: './manage/manage.module#ManageModule',
        },
        ]
    },


];
