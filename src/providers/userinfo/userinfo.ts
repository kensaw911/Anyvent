import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class UserinfoProvider {

  constructor(
    private afDatabase: AngularFireDatabase
  ) {}

  public getUserDetails(email:string) {
    let profileSubs: Subscription;

    if(email) {
      let filteredEmail = email.replace('.', 'dot');
      try{
        profileSubs = this.afDatabase.list('profile/' + filteredEmail).valueChanges().subscribe(profile => {
          localStorage.setItem('fav', profile[0]+"");
          localStorage.setItem('fname', profile[1]+"");
          localStorage.setItem('lname', profile[2]+"");
          localStorage.setItem('rewardPoints', profile[3]+"");

          profileSubs.unsubscribe();
        });
      }catch(e) {

      }

    }
  }

  public setUserDetails(email:string, userInfo:any) {
    //profile registration
    let filteredEmail = email.replace('.', 'dot');
    this.afDatabase.object('profile/' + filteredEmail).set(userInfo);
  }

  public modifyFavourites(email:string, favStr:string) {
    //add or remove favourites of user
    let filteredEmail = email.replace('.', 'dot');
    this.afDatabase.object('profile/' + filteredEmail + '/favourites').set(favStr);
  }

  public getUserFavourites(email:string) {
    let profileSubs: Subscription;

    if(email) {
      let filteredEmail = email.replace('.', 'dot');
      try{
        profileSubs = this.afDatabase.list('profile/' + filteredEmail + '/favourites').valueChanges().subscribe(profile => {

          localStorage.setItem('fav', profile[0]+"");

          profileSubs.unsubscribe();
        });
      }catch(e) {

      }
    }
  }

}
