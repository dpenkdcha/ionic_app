import { Injectable } from '@angular/core';
import { UtilityService } from '../services/utility.service';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  myQuetions:any;
  constructor(private utilityService:UtilityService) { } 

  login(username:String,password:String):Observable<any>{
    return this.utilityService.call('/auth/login',{username:username,password:password});
  }
}
 