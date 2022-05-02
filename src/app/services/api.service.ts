import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { forkJoin } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private externalApi = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  //Places
  getPlacesAll(): Observable<any> {
    return this.http.get(this.externalApi + '/v1/places');
  }

  public getOnePlace(id: any): Observable<any> {
    return this.http.get(this.externalApi + '/place/' + id);
  }

  httpPlaceMarker() {
    return this.http.get(this.externalApi + '/v1/places');
  }

  //Events
  getEventsAll(): Observable<any> {
    return this.http.get(this.externalApi + '/v1/events');
  }

  public getOneEvent(id: any): Observable<any> {
    return this.http.get(this.externalApi + '/event/' + id);
  }

  httpEventMarker() {
    return this.http.get(this.externalApi + '/v1/events');
  }
  //Activities
  getActivitiesAll(): Observable<any> {
    return this.http.get(this.externalApi + '/v1/activities');
  }

  public getOneActivity(id: any): Observable<any> {
    return this.http.get(this.externalApi + '/activity/' + id);
  }

  httpActivityMarker() {
    return this.http.get(this.externalApi + '/v1/activities');
  }

  // All in one

  getAll(): Observable<Object> {
    let allPlaces = this.http.get(this.externalApi + '/v1/places');
    let allEvents = this.http.get(this.externalApi + '/v1/events');
    let allActivities = this.http.get(this.externalApi + '/v1/activities')
    return forkJoin([allPlaces,allEvents,allActivities]);
  }
}
