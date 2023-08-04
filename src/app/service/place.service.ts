import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Place } from '../types/place.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private http:HttpClient) { }

  getPlace():Observable<Place[]>{
    return this.http.get<Place[]>('http://api.sujoygiri.me/place/get-place');
  }

  addPlace(place:FormData):Observable<any>{
    return this.http.post('http://api.sujoygiri.me/place/add-place', place,  {
      reportProgress: true
    });
  }

  deletePlace(placeId:string):Observable<any>{
    return this.http.delete(`http://api.sujoygiri.me/place/delete-place/${placeId}`);
  }

}
