import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FavouritePage } from '../favourite/favourite';
import { FreelancePage } from '../freelance/freelance';
import { UserinfoProvider } from '../../providers/userinfo/userinfo';
import { LoginPage } from '../login/login';
import { GeneralproviderProvider } from '../../providers/generalprovider/generalprovider';
import { AlertController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  

  loaded: boolean = false;
  tabIndex: number  = 0;
  home = HomePage;
  favourite = FavouritePage;
  freelance = FreelancePage;
  firstName: string;
  rewardPoints: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public nativePageTransitions: NativePageTransitions,
    private generalProvider: GeneralproviderProvider,
    private alertCtrl: AlertController,
    public userInfo: UserinfoProvider) {
  }

  ionViewDidEnter() {
    this.firstName = localStorage.getItem('fname');
    this.rewardPoints = localStorage.getItem('rewardPoints');
  }

  ionViewCanEnter() {
    let email: string;

    email = localStorage.getItem('authUser');
    this.userInfo.getUserDetails(email);  
  }

  public transition(e):void {
    let options: NativeTransitionOptions = {
     direction:this.getAnimationDirection(e.index),
     duration: 200,
     slowdownfactor: -1,
     slidePixels: 0,
     iosdelay: 0,
     androiddelay: 0,
     fixedPixelsTop: 0,
     fixedPixelsBottom: 48
    };

    if (!this.loaded) {
      this.loaded = true;
      return;
    }

    this.nativePageTransitions.fade(options)
    .catch( (err) => alert(err));
  }

  private getAnimationDirection(index):string {
    var currentIndex = this.tabIndex;

    this.tabIndex = index;

    switch (true){
      case (currentIndex < index):
        return('left');
      case (currentIndex > index):
        return ('right');
    }
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    // ignore the style error
    let tabs = document.getElementsByClassName("tabs")[0] as HTMLElement;
    tabs.style.marginLeft = "0";
  }

  touchEvent(event) {
    // console.log(event);
    var side_menu_width = document.getElementById("mySidenav").offsetWidth;

    if(side_menu_width > 0) {
      this.closeNav();
    }
  }

  logout() {
    //alert confirmation box
    let alert = this.alertCtrl.create({
      title: 'Warning',
      message: "Are you sure you want to logout?",
      buttons: [
        {
          text: 'Yes',
          role: 'cancel',
          handler: () => {
            localStorage.removeItem('authUser');
            localStorage.removeItem('fname');
            localStorage.removeItem('rewardPoints');
            this.navCtrl.setRoot(LoginPage);
          }
        },
        {
          text: 'No',
          handler: () => {
          }
        }
      ]
    });
    
    alert.present();
  }

  viewProfile() {
    this.navCtrl.push(ProfilePage);
  }

  beOrganizer() {
    let msg = {
      title: 'Coming Soon', 
      subtitle: 'Oops. The feature has not implemented yet.'
    };
    
      this.generalProvider.alertMessage(msg);
  }
}
