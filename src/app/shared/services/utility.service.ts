import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { SERVICE_URL } from '../constants/app.constant';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      //'auth':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInVzZXJuYW1lIjoibmlyYXYiLCJpYXQiOjE1ODA2Mzg0MjAsImV4cCI6MTU4MDY0MjAyMH0.-kUDpkWYprwwXbnY-EkASwLgWb-ARKkh-uSi5_6t52Q'
    })
  };
  constructor(private http: HttpClient) { }

  call(mapping: string, body: any): Observable<any> {
    console.log(localStorage.getItem('auth'))
    if(localStorage.getItem('auth')){
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'auth':localStorage.getItem('auth')
        })
      };
      //httpOptions.headers.append('auth',localStorage.getItem('auth'));
    }
    return this.http.post<any>(SERVICE_URL+mapping, body, this.httpOptions).pipe(
        catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      error.error.message
      );
  };
}
