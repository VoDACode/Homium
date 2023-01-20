import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { SigninComponent } from './components/signin/signin.component';
import { AuthGuard } from './services/auth/AuthGuard';

const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: '', component: AppComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
