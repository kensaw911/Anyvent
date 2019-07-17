import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { GeneralproviderProvider } from '../../providers/generalprovider/generalprovider';
import { RegisterPage } from '../register/register';
import { userinfo } from '../../models/userinfo';
import { AngularFireAuth } from 'angularfire2/auth';
import { TabsPage } from '../tabs/tabs';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  passwordType: string = 'password';
  userInfo = {} as userinfo;
  loading: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private generalProvider: GeneralproviderProvider,
    private loginAuth: AngularFireAuth,
    private fb: Facebook
    ) 
  {

  }

  ionViewWillEnter()
  {
    let authUser = localStorage.getItem('authUser');

    if(authUser) {
      console.log("logged in before");
      // var message = {
      //   title: "ion view will enter",
      //   subtitle: authUser
      // }
      
      // this.generalProvider.alertMessage(message);  

      this.navCtrl.push(TabsPage, {
        email: authUser
      });
      // this.navCtrl.swipeBackEnabled = true;
    }
    else {
      console.log("not logged in before");
    }
  }

  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad LoginPage');
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

  //To reset password
  resetPassword() {

    var message;

    //Prompt alert box to fill in registered email and send recovery email 
    let prompt = this.alertCtrl.create({
      title: 'Forgot Password',
      message: 'Please enter registered email to reset the password',
      inputs: [
        {
          name: 'recoverEmail',
          placeholder: 'you@example.com'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => 
          {
            console.log('Cancel button clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => 
          {
            if(data.recoverEmail) 
            {
              if(this.generalProvider.validateEmail(data.recoverEmail))
              {
                let message;
                var loading = this.generalProvider.loading('Sending recovery email...');

                console.log("A recovery email sent to " + data.recoverEmail);
                this.loginAuth.auth.sendPasswordResetEmail(data.recoverEmail).then(() => {
                    //add toast
                    loading.dismiss().then(() => {
      
                      message = {
                        title: "Recovery email sent",
                        subtitle: "Please check your mailbox"
                      }
                      
                      this.generalProvider.alertMessage(message);  
                    });
                }, error => {
                  loading.dismiss().then(() => {
      
                    message = {
                      title: "Error resetting password",
                      subtitle: error.message
                    }
                    
                    this.generalProvider.alertMessage(message);  
                  });
                });
              }
              else 
              {
                console.log('email validation failed in reset password');
                  
                message = {
                  title: "Error resetting password",
                  subtitle: "This is not an email. Please fill in a registered email."
                }
                  
                this.generalProvider.alertMessage(message);  
              }
            }
          }
        }     
      ]
    });
    prompt.present();
  }

  //Register member
  register() {
    this.navCtrl.push(RegisterPage);
    this.navCtrl.swipeBackEnabled = true;
  }

  //Validate user textfields before proceed to login
  validateLogin() {
    let isErrorExist = false;
    let message;

    //email validation
    if(this.userInfo.email == undefined || 
      !this.generalProvider.validateEmail(this.userInfo.email) ||
      this.userInfo.email == "" ) {
      //prompt alert message
      message = {
        title: "Invalid email",
        subtitle: "Please enter your registered email address"
      };

      console.log("email incorrect")

      isErrorExist = true;
    }
    else if(this.userInfo.password == undefined || this.userInfo.password == "") {
        message = {
          title: "Invalid password",
          subtitle: "Please enter your password"
        };
  
        console.log("password incorrect")
        isErrorExist = true;
    }

    if(!isErrorExist) {
      this.login();
    }
    else {
      this.generalProvider.alertMessage(message);
    }
  }

  //Login member
  login() {
    //show loading icon
    this.loading = this.generalProvider.loading('Logging in...');


    this.loginAuth.auth.signInWithEmailAndPassword(this.userInfo.email, this.userInfo.password)
    .then(() => {
      let message;

      //check email verification
      if(this.loginAuth.auth.currentUser.emailVerified) {
        //once verified, set root page as tab page
        // this.navCtrl.setRoot(TabsPage);
        this.navCtrl.push(TabsPage, {
          email: this.userInfo.email
        });
        this.navCtrl.swipeBackEnabled = false;
      }
      else {
        //else prompt user to verify email
        message = {
          title: "Verify Email",
          subtitle: "Please verify your email before login"
        }

        this.generalProvider.alertMessage(message);
      }
    })
    .then(() => {
      localStorage.setItem('authUser', this.userInfo.email);
      // this.loginAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    })
    .catch((error) => {

      var message = {
        title: "Login Error",
        subtitle: "The email address or password you entered is incorrect"
      }
      
      this.generalProvider.alertMessage(message);
      
    }); 

     //Dismiss loading bar
     this.loading.dismiss();
  }

  //Login with Facebook
  loginWithFacebook() {
    this.fb.login(['public_profile', 'email'])
    .then((response: FacebookLoginResponse) => {
      var message = {
        title: "Login Successful",
        subtitle: ""
      }
      
      this.generalProvider.alertMessage(message);

      console.log('Status: ', response.status, '\nuserID: ', response.authResponse.userID);
      this.getFbEmail(response.authResponse.userID);
    })
    .catch((err) => {
      var message = {
        title: "Login Error",
        subtitle: err
      }
      
      this.generalProvider.alertMessage(message);
      console.log('Error loggin into Facebook', err);
    })
  }

  //Obtain facebook user details 
  getFbEmail(userid) {
    let email;
    this.fb.api("/"+userid+"/?fields=email,first_name,last_name",["public_profile"])
    .then((response) => {
      this.userInfo.fname = response.first_name;
      this.userInfo.lname = response.last_name;
      this.userInfo.email = response.email;
      email = response.email;
    })
    .then(() => {
      localStorage.setItem('authUser', email);
    });
  }
}
