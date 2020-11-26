import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './item/list/list.component';
import { RegisterComponent } from './item/register/register.component';

const routes: Routes = [
  // { path: '', redirectTo: '/register' },
  {
    path: 'register',
    data: { breadcrumb: 'Register' },
    component: RegisterComponent,
  },
  {
    path: 'list',
    data: { breadcrumb: 'List' },
    component: ListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
