import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { SearchComponent } from './components/search/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { HelperService } from './services/helper.service';
import { UploadComponent } from './components/upload/upload.component';
import { InstructionsComponent } from './components/instructions/instructions.component';
import { TranscriptionsComponent } from './components/transcriptions/transcriptions.component';
import { NgxFileDropModule } from 'ngx-file-drop';

@NgModule({
  declarations: [
    AppComponent,
    SearchbarComponent,
    SearchComponent,
    UploadComponent,
    InstructionsComponent,
    TranscriptionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxFileDropModule
  ],
  providers: [ HelperService, HttpClientModule ],
  bootstrap: [AppComponent],
  schemas: []
})
export class AppModule { }
