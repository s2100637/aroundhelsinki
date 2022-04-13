import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { LeafletEvent } from 'leaflet';
import { MarkerService } from './marker.service';
import { TranslateService } from '@ngx-translate/core';
import { Places } from './places';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { Distance } from './distance';
import { placements } from '@popperjs/core';
import { getPopperClassPlacement } from '@ng-bootstrap/ng-bootstrap/util/positioning';

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

  newDistances : Distance[] = [];


  constructor(
    private markerService: MarkerService,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'fi', 'se']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang()!;
    translate.use(browserLang.match(/en|fi|se/) ? browserLang : 'en');
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

    tiles.addTo(this.map);
    this.getDistance();
  }


  getDistance(): void {
    this.map.on('geosearch/showlocation', (e: LeafletEvent | any) => {
      const userY = e.location.y;
      const userX = e.location.x;
      let placeY = '';
      let placeX = '';
      this.markerService.getAllPlaces().subscribe((res: any) => {
        for (const c of res.data) {
          placeX = c.location.lon;
          placeY = c.location.lat;
          // console.log('user locarion: ' + userX + ' ' + userY);
          // console.log('placeX + placeY: ' + placeX + ' ' + placeY);

          let degrees = Math.PI / 180;
          let dLat = (parseFloat(placeY) - userY) * degrees;
          var dLon = (parseFloat(placeX) - userX) * degrees;
          var a =
            Math.pow(Math.sin(dLat / 2.0), 2) +
            Math.cos(userY * degrees) *
              Math.cos(userX * degrees) *
              Math.pow(Math.sin(dLon / 2.0), 2);
          var b = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          c.distance = b.toFixed(2);
          console.log("distance " + c.distance);
          this.newDistances.push(c.placeId, c.distance);
          // this.addDistanceToList(c.placeId);

        }

      });
    });
  }

  // addDistanceToList(placeId: any){
  //   for(const c of this.newDistances){
  //     var small = document.getElementById("distance");
  //     if(small && c.placeId === placeId){
  //       small.innerHTML = c.placeKm + "km";
  //     }
  //   }
  // }

  ngAfterViewInit(): void {
    this.initMap();
    this.markerService.makePlaceMarkers(this.map);
  }

  ngOnInit(): void {
    this.getAllPlaces();
  }

  getAllPlaces(): void {
    this.markerService.getAllPlaces().subscribe((res: Places) => {
      this.places.push(res);
    });
  }
}
