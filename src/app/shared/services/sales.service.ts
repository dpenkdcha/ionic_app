import { Injectable } from '@angular/core';
import { UtilityService } from '../services/utility.service';
import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private utilityService:UtilityService) { }

  getSales(): Observable<any> {
    return this.utilityService.call('/sale/all',{});
  }
}
 