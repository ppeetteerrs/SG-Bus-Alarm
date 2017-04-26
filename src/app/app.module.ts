//Ionic and Angular
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import { NativeStorage } from 'ionic-native';
import { NativeAudio } from 'ionic-native';
import { BackgroundGeolocation } from "ionic-native";

//App
import { MyApp } from './app.component';

//Pages
import { Pages } from '../pages/pages';

//Pipes
import { Pipes } from '../pipes/pipes';

//Providers
import { Providers } from '../providers/providers';


@NgModule({
  declarations: [
    MyApp,
    Pages,
    Pipes
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    BrowserModule,
    Ng2FilterPipeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Pages
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    Providers,
    NativeStorage,
    NativeAudio,
    BackgroundGeolocation
  ]
})

export class AppModule {}
