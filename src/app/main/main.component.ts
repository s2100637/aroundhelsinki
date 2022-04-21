import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { LeafletEvent } from 'leaflet';
import { MarkerService } from './marker.service';
import { TranslateService } from '@ngx-translate/core';
import { Places } from './places';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { OrderPipe } from 'ngx-order-pipe';
import { MainPipe } from './main.pipe';


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
  sortedCollection: any[];
  reverse: boolean = false;
  caseInsensitive: boolean = false;
  // content = document.getElementById("distance")?.textContent;

  
  constructor(
    private markerService: MarkerService,
    public translate: TranslateService, public orderPipe: OrderPipe
  ) {

    // this.sortedCollection = orderPipe.transform(this.places, this.order);

  }

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
    const userY = this.referenceLocation.y;
    const userX = this.referenceLocation.x;
    let placeX = placeLocation.lon;
    let placeY = placeLocation.lat;

    let degrees = Math.PI / 180;
    let dLat = (parseFloat(placeY) - userY) * degrees;
    var dLon = (parseFloat(placeX) - userX) * degrees;
    var a =
      Math.pow(Math.sin(dLat / 2.0), 2) +
      Math.cos(userY * degrees) *
        Math.cos(userX * degrees) *
        Math.pow(Math.sin(dLon / 2.0), 2);
    var b = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    this.placeDistance = b.toFixed(2);
    return this.placeDistance;

  }

  ngAfterViewInit(): void {
    this.initMap();
    this.saveReferenceLocation();
    this.markerService.makePlaceMarkers(this.map);
  }

  ngOnInit(): void {
    // this.getAllPlaces();
    this.getExternalAll();
  }

  // getAllPlaces(): void {
  //   this.markerService.getAllPlaces().subscribe((res: Places) => {
  //     this.places.push(res);
  //   });
  // }

  getExternalAll(): void {
    this.markerService.getExternalAll().subscribe((res: Places ) => {
      // console.log(res);
      // console.log("distance " + document.getElementById("distance")?.textContent);
      this.places.push(res);
    });
  }

  

  // setOrder(value: string) {
  //   if (this.order === value) {
  //     this.reverse = !this.reverse;
  //   }
   
  //   this.order = value;
  // }
}
