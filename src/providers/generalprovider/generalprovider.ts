import { AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';

/*
  Generated class for the GeneralproviderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeneralproviderProvider {
  loadingHandler;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private network: Network,
    private toast: ToastController
    ) {
  }

  //alert desired message to user
  public alertMessage(message: any) {
    let alert = this.alertCtrl.create ({
      title: message.title,
      subTitle: message.subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  //show loading icon
  public showLoading(details: string) {
    this.loadingHandler = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: details
    });

    this.loadingHandler.present();
    return this.loadingHandler;
  }

  //hide loading icon
  public hideLoading() {
    this.loadingHandler.dismiss();
  }

  //alert confirmation box
  public confirmationBox(messageInfo: string) {
    let alert = this.alertCtrl.create({
      title: 'Warning',
      message: messageInfo,
      buttons: [
        {
          text: 'Yes',
          role: 'cancel',
          handler: () => {
            alert.dismiss(true);
            return false;
          }
        },
        {
          text: 'No',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        }
      ]
    });
    
    return alert;
  }

   //Validate email 
   public validateEmail(email: string) 
   {
     //validate email regex
     let validationRegex = /^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
     
     if(validationRegex.test(email)) 
     {
       return true;
     }
 
     return false;
   }

   //Display curent network connection
   public isNetworkConnected()
   {
     let networkType = this.network.type;

     if(networkType == "none" || networkType == "") {
       return false;
     }
     else {
       return true;
     }
   }

   //Display toast message
   public showToast(description: string) {
     let showToast = this.toast.create({
       message: description,
       duration: 1500,
       dismissOnPageChange: true,
       showCloseButton: true
     });
     
     showToast.present();
   }
}
