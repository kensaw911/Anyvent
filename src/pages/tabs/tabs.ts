import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FavouritePage } from '../favourite/favourite';
import { FreelancePage } from '../freelance/freelance';
import { UserinfoProvider } from '../../providers/userinfo/userinfo';

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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public nativePageTransitions: NativePageTransitions,
    public userInfo: UserinfoProvider) {
  }

  ionViewDidLoad() {
    let email: string;

    console.log('ionViewDidLoad TabsPage');

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
}
