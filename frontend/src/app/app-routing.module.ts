import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { SearchComponent } from './components/search/search.component';
import { UploadComponent } from './components/upload/upload.component';
import { InstructionsComponent } from './components/instructions/instructions.component';
import { TranscriptionsComponent } from './components/transcriptions/transcriptions.component';

export const routes: Routes = [
  { path: '', component: InstructionsComponent},
  { path: 'search', component: SearchComponent},
  { path: 'transcriptions', component: TranscriptionsComponent},
  { path: 'transcribe', component: UploadComponent},
  { path: '**', redirectTo: '/', pathMatch: 'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
