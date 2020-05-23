import { Routes } from '@angular/router';
import { RegisterLayoutComponent } from './register/register-layout.component';
import { ManageLayoutComponent } from './manage/manage-layout.component';
import { AuthGuard } from './core/guard/auth.guard';
import { NotFoundComponent } from './404/not-found/not-found.component';

export const AppRoutes: Routes = [
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
        canActivate: [AuthGuard],
        children: [{
            path: '',
            loadChildren: './manage/manage.module#ManageModule',
        },
        ]
    },
    {
        path: '**',
        component: NotFoundComponent
    },
];
