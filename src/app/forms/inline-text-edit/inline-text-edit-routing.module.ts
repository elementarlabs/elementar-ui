import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Inline Text Edit',
    loadComponent: () => import('./overview/overview.component').then(c => c.OverviewComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InlineTextEditRoutingModule { }
