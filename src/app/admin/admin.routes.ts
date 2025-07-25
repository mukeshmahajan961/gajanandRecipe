// src/app/pages/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin.component';
import { ContactListComponent } from './contact-list/contact-list.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      { path: 'users', component: UserComponent },
      { path: 'contactList', component: ContactListComponent }
    ]
  },
];
