import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'; 
import {Event} from '../../models/event.model'; 
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable'; 
import { tap, take } from 'rxjs/operators';

/*
  Generated class for the EventServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventServiceProvider {

  public _events$ = new BehaviorSubject<any[]>([]);
  batch = 15;
  lastKey = '';
  finished = false;

  constructor(
    public db: AngularFireDatabase
  ) {
    this.nextPage().pipe(take(1)).subscribe();
  }

  get events$(): Observable<any[]> {
    return this._events$.asObservable();
  }

  mapListKeys<T>(list: AngularFireList<T>): Observable<T[]> {
    return list
       .snapshotChanges()
       .map(actions => 
          actions.map(action => 
             ({ key: action.key, ...action.payload.val() })
          )
       );
  }

  private getEvents(batch: number, lastKey: string): Observable<any[]> 
  {
    return this.mapListKeys<any>( 
        this.db.list<Event>('/events', ref => { 
          const query = ref
              .orderByChild('key')
              .limitToFirst(batch);
          return (lastKey) ? query.startAt(lastKey) : query;
        })
    );
  }

  nextPage(): Observable<any[]> {
    if (this.finished) { 
      return this.events$; 
    } 

    return this.getEvents(this.batch + 1, this.lastKey) 
       .pipe(
          tap(events => {
             this.lastKey = events[events.length-1]['key']; 
             const newEvents = events.slice(0, this.batch); 
             const currentEvents = this._events$.getValue(); 
             if (this.lastKey == newEvents[newEvents.length-1]['key']
             ) {
                  this.finished = true;
             }
             this._events$.next(currentEvents.concat(newEvents)); 
            })
       );
 }

}
