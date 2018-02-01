import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-home-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  today: Date = new Date();
  constructor() { }

  ngOnInit() {
  }

}
