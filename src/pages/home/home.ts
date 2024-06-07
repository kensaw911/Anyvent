import { Component, ElementRef, Renderer } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { take } from 'rxjs/operators';
import { EventInfoPage } from '../event-info/event-info';
import { UserinfoProvider } from '../../providers/userinfo/userinfo';
import { GeneralproviderProvider } from '../../providers/generalprovider/generalprovider';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  events$: Observable<any[]>;
  isEventFinished = false;
  heartColor = "iconwhite";
  favStr = localStorage.getItem('fav');
  favArr = this.favStr.split(',');

  //For Header
  headerHeight = 150;
  backgroundImg = '';
  hiddenImg = '';
  transDuration = 2;
  day = 'Evening';
  // lastName = localStorage.getItem('fname');

  public showSearchBar = false;
  public showTitle = true;

  email = localStorage.getItem('authUser');

  constructor(
    public navCtrl: NavController,
    public eventService: EventServiceProvider,
    public element: ElementRef, 
    public renderer: Renderer,
    private userInfoProvider: UserinfoProvider,
    private generalProvider: GeneralproviderProvider,
    private socialSharing: SocialSharing
    ) {}

  ionViewDidLoad() {
    this.getEvents();
  }

  ionViewWillEnter() {
    console.log("hello2", this.email);
    this.userInfoProvider.getUserFavourites(this.email);
    console.log("hello3", localStorage.getItem('fav'));
    this.favStr = localStorage.getItem('fav');
    this.favArr = this.favStr.split(',');
  }

  ionViewDidEnter() {
    let date = new Date();
    let hour = date.getHours();

    if(hour < 12) {
      this.day = 'Morning';
      this.backgroundImg = '../../assets/imgs/sunrise.jpg';
      this.hiddenImg = '../../assets/imgs/snoopy-hi.gif';
    }
    else if(hour > 12 && hour < 20) {
      this.day = 'Afternoon';
      this.backgroundImg = '../../assets/imgs/sunset.jpg';
      this.hiddenImg = '../../assets/imgs/snoopy.gif';
    }
    else {
      this.day = 'Evening';
      this.backgroundImg = '../../assets/imgs/nightsky.jpg';
      this.hiddenImg = '../../assets/imgs/snoopy-goodnight.gif';
    }

    this.userInfoProvider.getUserFavourites(this.email);
    this.favStr = localStorage.getItem('fav');
  }

  clickedSearchIcon() {
    this.showSearchBar = !this.showSearchBar;
    this.showTitle = !this.showTitle;
  }

  doInfinite(infiniteScroll): Promise<void> {
    if (!this.eventService.finished) { 
       return new Promise((resolve, reject) => {
          this.eventService.nextPage()
             .pipe(take(1))
             .subscribe(events => {
                console.log('Events:', events);
                resolve();
             });
       });
    }
    else {
      this.isEventFinished = true;
    }
    return Promise.resolve();
  }

  scroll(event) {
    if(event.scrollTop > 100) {
      this.headerHeight = 60;
      this.transDuration = 2;
    }
    else if(event.scrollTop < 100) {
      this.headerHeight = 150;
      this.transDuration = 8;
    }
  }

  doRefresh(refresher) {
    this.generalProvider.showLoading('');
   
    this.getEvents();
    refresher.complete();
    
    this.generalProvider.hideLoading();
  }

  getEvents() {
    this.events$ = this.eventService.events$;
  }

  displayEventInfo(eventKey: string) {
    this.navCtrl.push(EventInfoPage,{eventKey:eventKey});
  }

  addToFav(event) {
    let eventId = event.target.id+"";
    eventId = eventId.replace("\_fav","");

    let favArr;
    
    if(this.favStr != "undefined") {
     favArr = this.favStr.split(',');
    }
    else {
      favArr = new Array();
    }

    console.log("before: ", favArr);
   
    let favFound = false;

    for(var i=0;i<favArr.length;i++) {
      if(favArr[i] == eventId) {
        if(favArr.length > 1) {
          favArr.splice(i,1);
        }
        else {
          favArr[0] = "";
        }

        document.getElementById(eventId+"_fav").classList.remove("iconred");
        document.getElementById(eventId+"_fav").classList.add("iconwhite");
        favFound = true;

        this.generalProvider.showToast("Removed from Favourites");
        break;
      }
    }

    if(!favFound) {
      if(favArr[0] == "") {
        favArr[0] = eventId;
      }
      else {
        favArr.push(eventId);  
      }  

      document.getElementById(eventId+"_fav").classList.remove("iconwhite");
      document.getElementById(eventId+"_fav").classList.add("iconred");

      this.generalProvider.showToast("Added to Favourites");
    }

    if(favArr.length > 1) {
      this.favStr = favArr.join(',');
    }
    else {
      this.favStr = favArr[0];
    }
    
    localStorage.setItem('fav', this.favStr);

    console.log("after : ", favArr);
    this.userInfoProvider.modifyFavourites(this.email, this.favStr);
  }

  shareEvent(event) {
    let eventId = event.target.id+"";
    eventId = eventId.replace("\_share","");

    this.socialSharing.share("I found this event which is quite fun and interesting! And I would like to invite you to come with me! For more info, download Anyvent App from your App Store/Playstore now!");
  }
}
