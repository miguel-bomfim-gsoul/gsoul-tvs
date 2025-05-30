import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MidiasComponent } from './dashboard/midias/midias.component'
import { TvComponent } from './tv/tv.component';
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthComponent },
    {
      path: 'dashboard',
      component: DashboardComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'dashboard/midias',
      component: MidiasComponent,
      canActivate: [AuthGuard]

    },
    {
      path: 'tv/:tv_slug',
      component: TvComponent      
    }
];