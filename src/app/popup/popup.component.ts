import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MarkerService } from '../marker.service'; 
import { Modal } from '../map/modal';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  public places:any = []; //luo tyhjän arrayn jonne APIsta haetut tiedot tallennetaan
 
  constructor(private markerService: MarkerService) { }

  ngOnInit(): void {
    this.getData;
  }

  getData(): void {
    this.markerService.getPlaces()
      .subscribe((data:any) => this.places = data);
  }
}
