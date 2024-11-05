import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { SearchComponent } from './components/search/search.component';
import { UploadComponent } from './components/upload/upload.component';

export const routes: Routes = [
  // { path: '', component: SearchbarComponent},
  { path: 'search', component: SearchComponent},
  { path: 'transcribe', component: UploadComponent},
  { path: '**', redirectTo: '/', pathMatch: 'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
