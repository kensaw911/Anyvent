import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { EventInfoPage } from '../event-info/event-info';
import { take } from 'rxjs/operators';
import { GeneralproviderProvider } from '../../providers/generalprovider/generalprovider';

/**
 * Generated class for the FavouritePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favourite',
  templateUrl: 'favourite.html',
})
export class FavouritePage {
  favEvents$ = new Array();
  backgroundImg = '';
  isEmpty = true;
  email = localStorage.getItem('authUser');

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public eventService: EventServiceProvider,
    private generalProvider: GeneralproviderProvider
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavouritePage');
  }

  ionViewWillEnter() {
    this.generalProvider.showLoading('');
    let date = new Date();
    let hour = date.getHours();
    this.favEvents$ = [];

    if(hour < 12) {
      this.backgroundImg = '../../assets/imgs/sunrise.jpg';
    }
    else if(hour > 12 && hour < 20) {
      this.backgroundImg = '../../assets/imgs/sunset.jpg';
    }
    else {
      this.backgroundImg = '../../assets/imgs/nightsky.jpg';
    }

    this.getFavEvents();
    this.generalProvider.hideLoading();
  }

  getFavEvents() {
    let event = this.eventService.events$;
    let eventKeys = new Array();
    let favourites = localStorage.getItem('fav');
    console.log("hello", favourites);
    let favArr = favourites.split(',');

    event.forEach(element => {
      for(var i=0;i<element.length;i++) {
        eventKeys.push(element[i]['key']);
      } 
    });

    for(var i=0;i<favArr.length;i++) {
      for(var j=0;j<eventKeys.length;j++) {
        if(favArr[i] == eventKeys[j]) {
          this.favEvents$.push(event.source['value'][j]);
          this.isEmpty = false;
        }
      }
    }

    if(this.favEvents$.length == 0) {
      this.isEmpty = true;
    }
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
  
    return Promise.resolve();
  }

  displayEventInfo(eventKey: string) {
    this.navCtrl.push(EventInfoPage,{eventKey:eventKey});   
  }

}
