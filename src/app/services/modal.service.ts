import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  @Output() change: EventEmitter<Object> = new EventEmitter();

  constructor() { }

  placeOffer(info) {
    this.change.emit(info);
  }
}
