import { Component, OnDestroy, OnInit } from '@angular/core';
// import { map } from 'rxjs';

import { GlobalService } from 'src/app/global.service';
import { PlaceService } from 'src/app/service/place.service';
import { Place } from 'src/app/types/place.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  places: Place[] = [];
  isErrorOccured: boolean = false;
  timeOutFunction: any;
  constructor(
    protected globalService: GlobalService,
    private placeService: PlaceService
  ) {
    if (this.globalService.showToaster) {
      this.timeOutFunction = setTimeout(() => {
        this.globalService.showToaster = false;
      }, 3000);
    }
  }

  ngOnInit() {
    this.placeService.getPlace().subscribe({
      next: (response: Place[]) => {
        this.places = response;
      },
      error: (error: any) => {
        this.isErrorOccured = true;
      },
    });
  }

  ngOnDestroy() {
    clearTimeout(this.timeOutFunction);
  }
}
