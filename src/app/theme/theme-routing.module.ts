import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'colors',
    loadChildren: () => import('./colors/colors.module').then(c => c.ColorsModule),
    title: 'Colors'
  },
  {
    path: 'typography',
    loadComponent: () => import('./typography/typography.component').then(c => c.TypographyComponent),
    title: 'Typography'
  },
  {
    path: 'customize-theme',
    loadComponent: () => import('./customize/customize').then(c => c.Customize),
    title: 'Customize Theme'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRoutingModule { }
