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
  showMenuIcon: boolean = false;
  placeId: string = '';
  showMenu: boolean = false;
  showDeleteModal: boolean = false;
  disableButton: boolean = false;

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

  getAllPlaces() {
    this.placeService.getPlace().subscribe({
      next: (response: Place[]) => {
        this.places = response;
      },
      error: (error: any) => {
        this.isErrorOccured = true;
      },
    });
  }

  ngOnInit() {
    this.getAllPlaces();
  }

  onMouseEnter(placeId: string){
    this.showMenuIcon = true;
    this.placeId = placeId;
  }

  onMouseLeave(){
    this.showMenuIcon = false;
    this.showMenu = false;
    // this.placeId = '';
  }

  onShowMenu(){
    this.showMenu = true;
  }

  onClickDeleteButton(){
    this.showDeleteModal = true;
  }

  onConfirmPlaceDelete(placeId: string){
    this.disableButton = true;
    this.placeService.deletePlace(placeId).subscribe({
      next: (response: any) => {
        this.globalService.showToaster = true;
        this.globalService.toasterMessage = response.deletedPlaceName + ' deleted successfully';
        this.getAllPlaces();
      },
      error: (error: any) => {
        this.showDeleteModal = false;
        this.disableButton = false;
        this.globalService.showToaster = true;
        this.globalService.toasterMessage = error.error.message;
      },
      complete: () => {
        this.showDeleteModal = false;
        this.disableButton = false;
        clearTimeout(this.timeOutFunction);
        this.timeOutFunction = setTimeout(() => {
          this.globalService.showToaster = false;
        }, 3000);
      }
    });
    
  }

  onCancelPlaceDelete(){
    this.showDeleteModal = false;
  }

  ngOnDestroy() {
    this.placeId = '';
    clearTimeout(this.timeOutFunction);
  }
}
