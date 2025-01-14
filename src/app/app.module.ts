import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { GeneralproviderProvider } from '../providers/generalprovider/generalprovider';
import { RegisterPage } from '../pages/register/register';
import { firebaseConfig } from './app.firebase.config';
import { AngularFireModule } from 'angularfire2'
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { Network } from '@ionic-native/network';
import { Facebook } from '@ionic-native/facebook';
import { TabsPage } from '../pages/tabs/tabs';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { EventServiceProvider } from '../providers/event-service/event-service';
import { FavouritePage } from '../pages/favourite/favourite';
import { FreelancePage } from '../pages/freelance/freelance';
import { EventInfoPage } from '../pages/event-info/event-info';
import { Calendar } from '@ionic-native/calendar';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { EmailComposer } from '@ionic-native/email-composer';
import { SocialSharing } from '@ionic-native/social-sharing';
import { UserinfoProvider } from '../providers/userinfo/userinfo';
import { ComponentsModule } from '../components/components.module';
import { ProfilePage } from '../pages/profile/profile';
import { Brightness } from '@ionic-native/brightness';
import { NgxQRCodeModule } from 'ngx-qrcode2';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FavouritePage,
    FreelancePage,
    LoginPage,
    RegisterPage,
    TabsPage,
    EventInfoPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    ComponentsModule,
    NgxQRCodeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    TabsPage,
    FavouritePage,
    FreelancePage,
    EventInfoPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GeneralproviderProvider,
    AngularFireAuth,
    Network,
    Facebook,
    NativePageTransitions,
    EventServiceProvider,
    Calendar,
    LaunchNavigator,
    EmailComposer,
    UserinfoProvider,
    SocialSharing,
    Brightness,
    NgxQRCodeModule
  ]
})
export class AppModule {}
