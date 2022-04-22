import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { LeafletEvent } from 'leaflet';
import { ApiService } from '../services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { Places } from '../interfaces/places';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { OrderPipe } from 'ngx-order-pipe';
import { Injector, ApplicationRef, ComponentFactoryResolver, Type } from '@angular/core';
import { PopupComponent } from '../popup/popup.component';

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
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements AfterViewInit, OnInit {
  private map: L.Map;

  places: Places[] = [];
  closeResult: string = '';
  modalInfo: any;
  faLocationCrosshairs = faLocationCrosshairs;
  placeDistance: any;
  referenceLocation: any = {
    y: 60.16952,
    x: 24.93545
  };
  showDistance = false;
  one: 0.00;
  userY: any;
  userX: any;
  placeX: any;
  placeY: any;

  
  constructor(
    private apiService: ApiService,
    public translate: TranslateService,
    private resolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector, public orderPipe: OrderPipe
  ) {}

  private initMap(): void {
    this.map = L.map('map', {
      center: [60.16952, 24.93545],
      zoom: 12,
    });

    const provider = new OpenStreetMapProvider();
    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      autoClose: true,
    });
    this.map.addControl(searchControl);

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    this.saveReferenceLocation();
    tiles.addTo(this.map);
  }

  saveReferenceLocation(): void {
    this.map.on('geosearch/showlocation', (e: LeafletEvent | any) => {
      this.referenceLocation = e.location;
      this.showDistance = true;
    });
  }

  calculateDistance(placeLocation : any){
    this.userY = this.referenceLocation.y;
    this.userX = this.referenceLocation.x;
    this.placeX = placeLocation.lon;
    this.placeY = placeLocation.lat;

    return this.distance(this.userY, this.userX, this.placeX, this.placeY);
  }

  distance(userY: any, userX: any, placeX: any, placeY: any): any{
    let degrees = Math.PI / 180;
    let dLat = (parseFloat(placeY) - userY) * degrees;
    var dLon = (parseFloat(placeX) - userX) * degrees;
    var a =
      Math.pow(Math.sin(dLat / 2.0), 2) +
      Math.cos(this.userY * degrees) *
        Math.cos(this.userX * degrees) *
        Math.pow(Math.sin(dLon / 2.0), 2);
    var b = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    this.placeDistance = b.toFixed(2);
    return this.placeDistance;
  }

  hei(){
    this.apiService.httpPlaceMarker().subscribe((res: any) => {
      let lon: any;
      let lat: any;
      for (const c of res.data) {
        lon = c.location.lon;
        lat = c.location.lat;
        let distance = this.distance(this.referenceLocation.y, this.referenceLocation.x, lat, lon);
        c.distance = distance;
      }});

      console.log(this.places);
  }

  makeMapPopup(data: any): any{
    let markerPopup: any = this.compilePopup(PopupComponent, (c: any) => {
        (c.instance.place = data.name.fi),
        (c.instance.address = data.location.address.street_address),
        (c.instance.postalCode = data.location.address.postal_code),
        (c.instance.locality = data.location.address.locality),
        (c.instance.placeUrl = data.info_url),
        (c.instance.ownPage = data.id)
      });
      return markerPopup;
  }

  makePlaceMarkers(map: L.Map): void {
    this.apiService.httpPlaceMarker().subscribe((res: any) => {
      for (const c of res.data) {
        const lon = c.location.lon;
        const lat = c.location.lat;
        const marker = L.marker([lat, lon]);

        marker.bindPopup(this.makeMapPopup(c));

        marker.addTo(map);
      }
    });
  }

  private compilePopup(component: any, onAttach: any): any {
    const compFactory: any = this.resolver.resolveComponentFactory(component);
    let compRef: any = compFactory.create(this.injector);

    if (onAttach)
      onAttach(compRef);

    this.appRef.attachView(compRef.hostView);
    compRef.onDestroy(() => this.appRef.detachView(compRef.hostView));

    let div = document.createElement('div');
    div.appendChild(compRef.location.nativeElement);
    return div;
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.saveReferenceLocation();
    this.makePlaceMarkers(this.map);
  }

  ngOnInit(): void {
    this.getExternalAll();
  }

  getExternalAll(): void {
    this.apiService.getExternalAll().subscribe((res: Places ) => {
      this.places.push(res);
    });
  }
}
