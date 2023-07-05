import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { map } from 'rxjs';

interface Place {
  date: Date;
  placeName: string;
  placeDescription: string;
  placeImage: string;
  placeTags: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  places: Place[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<Place[]>('http://localhost:3000/place/get-place').subscribe({
      next: (response:Place[]) => {
        this.places = response;
      },
      error: (error:any) => {
        console.log(error);
      }
    });
  }
}
