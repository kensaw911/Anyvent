import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { userinfo } from '../../models/userinfo';
import { GeneralproviderProvider } from '../../providers/generalprovider/generalprovider';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  passwordType: string = 'password';
  userInfo = {} as userinfo;

  //textfield validation needs
  //firstName
  offFnameBlankText: boolean = true;
  offFnameInvalidText: boolean = true;

  //lastName
  offLnameBlankText: boolean = true;
  offLnameInvalidText: boolean = true;

  //email
  offEmailBlankText: boolean = true;
  offEmailInvalidText: boolean = true;

  //password
  offPassInvalidText: boolean = true;

  //confirm password
  offPassMismatchLogo: boolean = true;
  offPassMismatchText: boolean = true;

  loading: any;

  @ViewChild('passMismatch') passMismatch;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private generalProvider: GeneralproviderProvider,
    private registerAuth: AngularFireAuth,
    private angularfireDB: AngularFireDatabase
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  //Back button event back to LoginPage
  backToLogin() {
    this.navCtrl.pop();
  }

  //To reveal password when touched
  showPassword(event) 
  {
    console.log(event);
    this.passwordType ='text';
  }

  //To hide password when released
  hidePassword(event)
  {
    console.log(event);
    this.passwordType ='password';
  }

  registerValidation() {
    console.log("register button clicked");
    let errCount = 0;

    //show loading icon
    this.loading = this.generalProvider.loading('Validating...');

    //VALIDATION
    //first name validation
    if(this.userInfo.fname == undefined) {
      this.offFnameBlankText = false;
      this.offFnameInvalidText = true;
      errCount++;
    }
    else if(!this.userInfo.fname.match(/^[a-zA-Z][a-zA-Z\s]*$/)) {
      this.offFnameBlankText = true;
      this.offFnameInvalidText = false;
      errCount++;
    }
    else {
      this.offFnameBlankText = true;
      this.offFnameInvalidText = true;
    }

    //last name validation
    if(this.userInfo.lname == undefined) {
      this.offLnameBlankText = false;
      this.offLnameInvalidText = true;
      errCount++;
    }
    else if(!this.userInfo.lname.match(/^[a-zA-Z][a-zA-Z\s]*$/)) {
      this.offLnameBlankText = true;
      this.offLnameInvalidText = false;
      errCount++;
    }
    else {
      this.offLnameBlankText = true;
      this.offLnameInvalidText = true;
    }

    //email validation
    if(this.userInfo.email == undefined) {
      this.offEmailBlankText = false;
      this.offEmailInvalidText = true;
      errCount++;
    }
    else if(!this.generalProvider.validateEmail(this.userInfo.email)) {
      this.offEmailBlankText = true;
      this.offEmailInvalidText = false;
      errCount++;
    }
    else {
      this.offEmailBlankText = true;
      this.offEmailInvalidText = true;
    }

    //password validation
    if (this.userInfo.password == undefined || this.userInfo.password.length < 8) {
      this.offPassInvalidText = false;
      errCount++;
    }
    else {
      this.offPassInvalidText = true;
    }

    //confirm password validation
    if (this.userInfo.password !== this.userInfo.cpassword) {
      this.offPassMismatchLogo = false;
      this.offPassMismatchText = false;
      errCount++;
    }
    else {
      this.offPassMismatchLogo = true;
      this.offPassMismatchText = true;
    }

    //if validation success
    //console.log(errCount);
    if(errCount == 0) {
      if(this.generalProvider.isNetworkConnected) {
        this.register();
      }
      else {
        //prompt alert message
        this.loading.dismiss();
        var message = {
          title: "Connection Failed",
          subtitle: "There may be a problem in your internet connection. Please try again"
        };

        this.generalProvider.alertMessage(message);      
      }    
    }
    else {
      this.loading.dismiss();
    }
  }

  register() {

    let email = this.userInfo.email;
    let password =  this.userInfo.password;

    //register credential into firebase
    this.registerAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      //saved user info in firebase
      let registeredUserInfo = {};
      registeredUserInfo['fname'] = this.userInfo.fname;
      registeredUserInfo['lname'] = this.userInfo.lname;
      registeredUserInfo['rewardPoints'] = 0;
      registeredUserInfo['favourites'] = '';

      //profile registration
      let filteredEmail = email.replace('.', 'dot');
      this.angularfireDB.object('profile/' + filteredEmail).set(registeredUserInfo);
    })
    .then(() => {
      let user = this.registerAuth.auth.currentUser;
      // console.log(user);
      user.sendEmailVerification();
    })
    .then(() => {
      //dismiss loading bar
      this.loading.dismiss();

      //prompt alert message     
      var message = {
        title: "Register Successfully",
        subtitle: "Your account has been registered successfully. A verification email has been sent to your email account"
      };

      this.generalProvider.alertMessage(message);

      //Set all to empty
      this.userInfo.fname = undefined;
      this.userInfo.lname = undefined;
      this.userInfo.email = undefined;
      this.userInfo.password = undefined;
      this.userInfo.cpassword = undefined;
      this.userInfo.rewardPoints = undefined;

      this.backToLogin();
    })
    .catch((exception) => {
      var message = {
        title: "Register Failed",
        subtitle: exception
      };
      
      this.generalProvider.alertMessage(message);
      this.loading.dismiss();
    });
  }
}
