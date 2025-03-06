import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'error',
    loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
  },
  {
    path: '',
    loadComponent: () => import('./common/common.component').then(c => c.CommonComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./main/main.component').then(c => c.MainComponent),
        title: 'Home'
      }
    ]
  },
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () => import('./error/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
