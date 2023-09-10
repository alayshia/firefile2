import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileDownloaderComponent } from './file-downloader/file-downloader.component'

@NgModule({
  declarations: [
    AppComponent,
    FileDownloaderComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
