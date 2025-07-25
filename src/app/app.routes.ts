import { Routes } from '@angular/router';
import { NotfoundComponent } from './notfound/notfound.component';

export const routes: Routes = [

    {
        path: '',
        loadChildren: () =>
            import('./frontend/frontend.routes').then((m) => m.FRONTEND_ROUTES),
    },
    {
        path: 'admin',
        loadChildren: () =>
            import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    },
    {
        path: '**',
        component: NotfoundComponent
    },
];
