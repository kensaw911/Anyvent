import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { take } from 'rxjs/operators';
import {Content} from 'ionic-angular';
import { EventInfoPage } from '../event-info/event-info';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  events$: Observable<any[]>;
  isEventFinished = false;

  //For Header
  headerHeight = 150;
  backgroundImg = '';
  hiddenImg = '';
  transDuration = 2;
  day = 'Evening';
  lastName = localStorage.getItem('fname');

  public showSearchBar = false;
  public showTitle = true;

  constructor(
    public navCtrl: NavController,
    public eventService: EventServiceProvider,
    public element: ElementRef, 
    public renderer: Renderer
    ) {}

  ionViewDidLoad() {
    this.getEvents();
    // this.content.ionScroll.subscribe((ev) => {
    //   this.resizeHeader(ev);
    // })
  }

  ionViewDidEnter() {
    let date = new Date();
    let hour = date.getHours();
    console.log("Curent time : ", hour);

    if(hour < 12) {
      this.backgroundImg = '../../assets/imgs/sunrise.jpg';
      this.hiddenImg = '../../assets/imgs/snoopy-hi.gif';
    }
    else if(hour > 12 && hour < 20) {
      this.backgroundImg = '../../assets/imgs/sunset.jpg';
      this.hiddenImg = '../../assets/imgs/snoopy.gif';
    }
    else {
      this.backgroundImg = '../../assets/imgs/nightsky.jpg';
      this.hiddenImg = '../../assets/imgs/snoopy-goodnight.gif';
    }
  }

  // resizeHeader(ev){
    // if(ev.scrollTop > 200){
    //   this.headerHeight = 60;   
    // }
    // else { 
    //   this.headerHeight = 200 - ev.scrollTop;
    //   console.log("scrollTop: ", ev.scrollTop);
    //   console.log("headerHeight: ", this.headerHeight);
    // }
  // }

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
    else if(event.scrollTop < 10) {
      this.headerHeight = 150;
      this.transDuration = 8;
    }
  }

  doRefresh(refresher) {
    this.getEvents();

    refresher.complete();
  }

  getEvents() {
    this.events$ = this.eventService.events$;
  }

  displayEventInfo(eventKey: string) {
    this.navCtrl.push(EventInfoPage,{eventKey:eventKey});
  }
}
