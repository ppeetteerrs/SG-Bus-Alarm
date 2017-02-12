//Ionic and Angular
import { NgModule, ErrorHandler, IonicApp, IonicModule, IonicErrorHandler, HttpModule, Ng2FilterPipeModule } from './imports';

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
    Ng2FilterPipeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Pages
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    Providers
  ]
})

export class AppModule {}
