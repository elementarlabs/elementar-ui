import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'error',
    loadChildren: () => import('./error/error.module').then(m => m.ErrorModule),
  },
  {
    path: '',
    loadComponent: () =>
      import('./common/common.component').then(c => c.CommonComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./main/main.component').then(c => c.MainComponent),
        children: [
          {
            path: 'home',
            loadComponent: () =>
              import('./pages/home/home.component').then(c => c.HomeComponent),
            title: 'Home',
          },
        ],
      },
    ],
  },
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () =>
      import('./error/not-found/not-found.component').then(
        c => c.NotFoundComponent
      ),
  },
];
