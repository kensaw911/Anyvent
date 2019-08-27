import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';
import { Calendar } from '@ionic-native/calendar';
import { GeneralproviderProvider } from '../../providers/generalprovider/generalprovider';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { EmailComposer } from '@ionic-native/email-composer';

/**
 * Generated class for the EventInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-info',
  templateUrl: 'event-info.html',
})
export class EventInfoPage {
  isReadmore = false;
  eventKey: string;
  eventInfo: Subscription;
  eventDetails = {} as any;
  fullEventDesc: string = "";
  //To show date to customers
  showDate: string;
  startTime: string;
  endTime: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afDatabase: AngularFireDatabase,
    private generalProvider: GeneralproviderProvider,
    private calendar: Calendar,
    private launchNav: LaunchNavigator,
    private emailComposer: EmailComposer) {
    this.eventKey = navParams.get('eventKey');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventInfoPage');
    this.getEventInfo();
  }

  getEventInfo(){
    let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    this.eventInfo = this.afDatabase.list('events/' + this.eventKey).valueChanges().subscribe(info => {
      // this.eventDetails.date = info[0]+"";
      this.eventDetails.date = "2019-08-15";
      this.eventDetails.email = info[1]+"";
      this.eventDetails.eventDesc = info[2]+"";
      this.eventDetails.eventName = info[3]+"";
      this.eventDetails.eventType = info[4]+"";
      this.eventDetails.location = info[6]+"";
      this.eventDetails.phone = info[7]+"";
      // this.eventDetails.time = info[8]+"";
      this.eventDetails.time = "6:30AM - 8:30PM";

      if(this.eventDetails.eventDesc.length > 150) {
        this.fullEventDesc = this.eventDetails.eventDesc;
        this.eventDetails.eventDesc = this.eventDetails.eventDesc.substring(0,150) + "...";
        this.isReadmore = true;
      }

      if(this.eventDetails.date) {
        let d = new Date(this.eventDetails.date);
        // console.log(d.getDay());
        this.showDate = this.eventDetails.date + " ("+ days[d.getDay()] + ")";
        // this.eventDetails.date = this.eventDetails.date + " ("+ days[d.getDay()] + ")";
      }

      if(this.eventDetails.time) {
        let splitTime = this.eventDetails.time.split(" - ");

        for(var i=0;i<splitTime.length;i++) 
        {
          let hour = parseInt(splitTime[i].split(":")[0]);
          let hourInString;
          let minutes = splitTime[i].split(":")[1];
          let re = /AM|PM/;
          minutes = minutes.replace(re, "");

          if(i == 0)
          {
            if(splitTime[i].includes("PM")) {
              hour = hour + 12;
              hourInString = hour;
            } 
            else if(splitTime[i].includes("AM")) {
              hourInString = "0" + hour;
            }

            this.startTime = hourInString + ":" + minutes + ":00";   
          }
          else if (i == 1) {
            if(splitTime[i].includes("PM")) {
              hour = hour + 12;
              hourInString = hour;
            } 
            else if(splitTime[i].includes("AM")) {
              hourInString = "0" + hour;
            }
            
            this.endTime = hourInString + ":" + minutes + ":00";
          }
        }
      }

      if(this.eventDetails.eventType) {
        let splitType = this.eventDetails.eventType.split(",");

        for(var j=0;j<splitType.length;j++) 
        {
          splitType[j] = splitType[j].trim();
          splitType[j] = "#" + splitType[j];
        }

        this.eventDetails.eventType = splitType.join("  ");
      }
     
      console.log(this.eventDetails);
      this.eventInfo.unsubscribe();
    });
  }

  readMoreDesc() {
    if(this.isReadmore)
    {
      document.getElementById('readButton').innerHTML = 'Read Less';
      document.getElementById('eventDesc').innerHTML = this.fullEventDesc;
      this.isReadmore = false;
    }
    else {
      document.getElementById('readButton').innerHTML = 'Read More';
      document.getElementById('eventDesc').innerHTML = this.eventDetails.eventDesc;
      this.isReadmore = true;
    }   
  }

  addToCalendar() {

    let newStartDate = new Date(this.eventDetails.date + "T" + this.startTime);
    let newEndDate = new Date(this.eventDetails.date + "T" + this.endTime);

    if(this.calendar.hasWritePermission()) {
      this.calendar.createEvent(this.eventDetails.eventName, this.eventDetails.location, "", newStartDate, newEndDate);
      this.generalProvider.showToast("Successfully added to your calendar. Have fun!");
    }
    else {
      this.generalProvider.alertMessage("Uh oh. It seems like you do not give permission for us to access your calendar. Please allow access in your settings");
    }
  }

  navigate() {
    let options: LaunchNavigatorOptions = {
      start: this.eventDetails.location
    };

    this.launchNav.navigate(this.eventDetails.location, options)
    .then(
      success => this.generalProvider.alertMessage("Navigate successfully"),
      error => this.generalProvider.alertMessage("Navigate error: " + error)
    );
  }

  sendEmail() {
    let email = {
      to: this.eventDetails.email,
      subject: 'Enquiries for: ' + this.eventDetails.eventName,
      isHtml: true
    };

    this.emailComposer.isAvailable().then((available: boolean) => {
      if(available) {
        this.emailComposer.open(email);
      }
    })
  }
}
