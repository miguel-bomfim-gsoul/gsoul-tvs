import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MidiasComponent } from './components/dashboard/midias/midias.component'
import { TvEditComponent } from './components/dashboard/tv-edit/tv-edit.component';
import { TvComponent } from './components/tv/tv.component';
import { AuthGuard } from './core/guards/auth.guard';

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
    { path: 'dashboard/edit/:tv_id', component: TvEditComponent, canActivate: [AuthGuard] },
    {
      path: 'tv/:tv_id',
      component: TvComponent      
    }
];