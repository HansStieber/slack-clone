import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  public toggle: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
