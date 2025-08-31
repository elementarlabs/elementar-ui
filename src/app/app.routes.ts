import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./overview/overview.component').then(c => c.OverviewComponent),
    title: 'Overview'
  },
  {
    path: 'installation',
    loadComponent: () => import('./installation/installation').then(c => c.Installation),
    title: 'Installation'
  },
  {
    path: 'theme',
    loadChildren: () => import('./theme/theme.module').then(m => m.ThemeModule)
  },
  {
    path: 'forms',
    loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule)
  },
  {
    path: 'components',
    loadChildren: () => import('./components/components.module').then(m => m.ComponentsModule)
  },
  {
    path: 'navigation',
    loadChildren: () => import('./navigation/navigation.module').then(m => m.NavigationModule)
  },
  {
    path: 'micro-charts',
    loadChildren: () => import('./micro-charts/micro-charts.module').then(m => m.MicroChartsModule)
  },
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () => import('./error/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
