import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  showToaster: boolean = false;

  constructor() { }
}
