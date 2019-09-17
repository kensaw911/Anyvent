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

}
