import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { PostComponent } from './post.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'post', component: PostComponent }
];
