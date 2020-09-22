import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'partido',
    loadChildren: () => import('./paginas/partido/partido.module').then( m => m.PartidoPageModule)
  },
  {
    path: 'lista-partidos',
    loadChildren: () => import('./paginas/lista-partidos/lista-partidos.module').then( m => m.ListaPartidosPageModule)
  },
  {
    path: 'ranking',
    loadChildren: () => import('./paginas/ranking/ranking.module').then( m => m.RankingPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
