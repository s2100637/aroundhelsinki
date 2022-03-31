import { Component, AfterViewInit, OnInit, Type, ComponentFactoryResolver, Injector, ApplicationRef } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from '../marker.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from './modal';
import {TranslateService} from '@ngx-translate/core';
import { PopupComponent } from '../popup/popup.component';
import { HttpClient } from '@angular/common/http';


const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: L.Map;
  closeResult: string = '';

  places: string = 'assets/data/places.json';
  place: any;

  modal: Modal[] = [];
   modalInfo : any;
  // modal: Modal[] = [];
   

  constructor(
    private markerService: MarkerService,
    private modalService: NgbModal, 
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private http: HttpClient) { }
  
 // Initialize the map to display Helsinki
  private initMap(): void {
    this.map = L.map('map', {
      center: [60.16952, 24.93545 ],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    console.log("initMap");

  }

  makePlaceMarkers(map: L.Map): void {
    console.log("makePlaceMarkers");

    this.http.get(this.places).subscribe((res: any) => {
      for (const c of res.data) {
        const lon = c.location.lon;
        const lat = c.location.lat;
        const marker = L.marker([lat, lon]);
      
        marker.bindPopup(this.makeMapPopup(c));
        // console.log("makePalceMarkers c" + c);
        marker.addTo(map);
      }
    });
  }


  ngAfterViewInit(): void {
    this.initMap();
    this.markerService.makePlaceMarkers(this.map);
    console.log("ngAfterViewInit");

  }


  makeMapPopup(data: any): any{
    // console.log("makeMapPopup data" + data);
    this.makeMapPopup(data).subscribe((res: any) => {
      this.modalInfo = res;
      // console.log("makeMapPopup res" + res);
    })
  }

  ngOnInit(){
    // console.log("ngOnInit modalinfo" + this.modalInfo);
    this.place = this.modalInfo;
    this.makeMapPopup(this.place);
    // console.log("ngOnInit place" + this.place);

  }

  
  
  // makeMapPopup(data: any): any{
  //   return  `` +
  //   `<div>Place: ${ data.name.fi }</div>` +
  //   `<div>Address: ${ data.location.address.street_address } ${ data.location.address.postal_code } ${ data.location.address.locality } </div>` +
  //   `<div>Opening Hours: ${ data.opening_hours.hours[1].weekday_id } ${ data.opening_hours.hours[0].opens } ${ data.opening_hours.hours[0].closes } ${ data.opening_hours.hours[0].open24h }</div>`;
  // }


  


  /*Builds the referenced component so it can be injected into the 
  * leaflet map as popup.
  * Original code from:  https://github.com/darkguy2008/leaflet-angular4-issue/blob/master/src/app.ts
  */
//  private compilePopup(component: Type<unknown>, onAttach: { (c: any): void; (arg0: any): void; }): any {
//    const compFactory: any = this.resolver.resolveComponentFactory(component);
//    let compRef: any = compFactory.create(this.injector);

//    // onAttach allows you to assign 
//    if (onAttach)
//      onAttach(compRef);

//    this.appRef.attachView(compRef.hostView);
//    compRef.onDestroy(() => this.appRef.detachView(compRef.hostView));
   
//    let div = document.createElement('div');
//    div.appendChild(compRef.location.nativeElement);
//    return div;
//  }




//  centerMap(lat: number, lng: number): void {
//   this.map.panTo([lat, lng]);
//   let markerPopup: any = this.compilePopup(PopupComponent, 
//     (c) => {c.instance.customText = 'Custom Data Injection'});
//   let currentLocation: L.CircleMarker = L.circleMarker([lat, lng], {
//     radius: 5
//   })
//   .bindPopup(markerPopup);
//   currentLocation.addTo(this.map);
//   setTimeout(() => {this.map.setZoom(8);}, 750);
// }
 

 /* centerMap(lat: number, lng: number): void {
  
  this.map.panTo([lat, lng]);
 
  let markerPopup: any = this.compilePopup(PopupComponent, 
    (c) => {c.instance.customText = 'Custom Data Injection'});
  
  let currentLocation: L.CircleMarker = L.circleMarker([lat, lng], {
    radius: 5
  })
  
  .bindPopup(markerPopup);
  currentLocation.addTo(this.map);
  
  setTimeout(() => {this.map.setZoom(8);}, 750);
}
 */
  

/* https://stackblitz.com/edit/angular-ivy-leafletjs-map-popup?file=src%2Fapp%2Fmap%2Fmap.component.ts */





/* ngOnInit(){
    this.modal = this.modalInfo;
    this.placeModal(this.modal);
  }

  placeModal(data: any){
    this.markerService.makeMapPopup(data).subscribe((res: any) => {
      this.modalInfo = res;
      document.getElementById('');
      console.log(res);
    })

    

*/
  } 