import { Component, OnInit } from '@angular/core';
import { MarkerService } from '../marker.service'; 

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  constructor(private markerService: MarkerService) { }

  ngOnInit(): void {
  }

}
