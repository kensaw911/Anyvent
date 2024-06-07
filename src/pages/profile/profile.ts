import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Brightness } from '@ionic-native/brightness';
import { UserinfoProvider } from '../../providers/userinfo/userinfo';
import { LoginPage } from '../login/login';


/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  createdCode = null;
  photoUrl: string;
  firstName: string;
  lastName: string;
  rewardPoints: string;
  overlayHidden: boolean = true;
  loading: any;

  email = localStorage.getItem('authUser');

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private userInfoProvider: UserinfoProvider,
    private alertCtrl: AlertController,
    private brightness: Brightness) {
  }

  ionViewWillLoad(){
    this.userInfoProvider.getUserDetails(this.email);   
  }

  ionViewDidLoad() {
    console.log(localStorage.getItem('fav'));
    this.firstName = localStorage.getItem('fname');
    this.lastName = localStorage.getItem('lname');
    this.rewardPoints = localStorage.getItem('rewardPoints');

    this.createQRCode('12341234235'); 
  }

  createQRCode(uid:string) {
    this.createdCode = uid;
  }

  closeClearQr() {
    this.overlayHidden = true;
    this.brightness.setBrightness(0.5);
    this.brightness.setKeepScreenOn(true);
  }

  openClearQr() {
    this.overlayHidden = false;
    this.brightness.setBrightness(1);
    this.brightness.setKeepScreenOn(true);
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
}
