import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as L from 'leaflet';



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


@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.css']})
export class PlaceDetailComponent implements OnInit {
  placeid:any;
  places: any;
  date: Date = new Date();
  faCheck = faCheck;
  faTimes = faTimes;
  link: string = '';
  newImageString: string = '';
  private map: L.Map;

  constructor(private apiService: ApiService,
              private route: ActivatedRoute
              ) {
                this.link = 'https://edit.myhelsinki.fi/sites/default/files/styles';
               }

  ngOnInit(): void {
    this.getOnePlace();
    this.mapInit();
    this.marker();
  }

  mapInit() {
    this.map = L.map('map', {
      center: [60.16952, 24.93545],
      zoom: 12,
    });
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
  }

  marker(){
    let lon = this.places?.location.lon;
    let lat = this.places?.location.lat;

    const marker = L.marker([lat, lon], { icon: iconDefault });
    marker.addTo(this.map);

  }

  getOnePlace(): void {
    this.route.paramMap.pipe(switchMap(params => {
      this.placeid = params.get('id');
      return this.apiService.getOnePlace(this.placeid)
    })
    ).subscribe(data => {
      if (data.id == this.placeid) {
        this.places = data;
      }
    })

  }

  getImageUrl(link2: string){
    var linklast = link2?.slice(68,1000);
    var imglink = `${this.link}/hero_image/${linklast}`;
    return imglink;
  }

  changeImg(event: any){
    this.newImageString = event.target.getAttribute('src');
    document.getElementById('view-img')?.setAttribute('src', this.newImageString);
  }
}
