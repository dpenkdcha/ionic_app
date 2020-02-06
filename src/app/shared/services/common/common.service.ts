import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ServletURL, ServiceType, UrlOptions, IdentifyPlatform } from '../../constants/app.constant';
import { Platform } from '@ionic/angular';
import { DatabaseService } from '../database/database.service';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

    constructor(
      public platform: Platform,
      private httpClient: HttpClient,
      private databaseService: DatabaseService) {
       
      }


    // Check connection if online or offline
    public checkConnnection() {
      return navigator.onLine;
    }

    // Check platform
    public checkPlatform() {
      if(this.platform.is("android")) {
        return IdentifyPlatform.Android; 
      } else if(this.platform.is("ios")) {
        return IdentifyPlatform.IOS;
      } else {
        return IdentifyPlatform.Web;
      }
    }

    // 
    public callService(serviceName, serviceType, urlOption?: UrlOptions): Observable<any> {
      if(this.platform.is("android") || this.platform.is("ios")) {
        this.databaseService.createQuery(urlOption).subscribe(
          (res: any) => {
            if(this.checkConnnection() && res[status] === 200) { 
              // this.callToExternalService(serviceName, serviceType, urlOption).subscribe(
              //   (res: any) => {
              //     this.dataToLocal(urlOption).subscribe(
              //       (res: any) => {
                    
              //       }
              //     )
              //   }
              // )
            }
          }
        )
      } else {
        this.callToExternalService(serviceName, serviceType, urlOption).subscribe(
          (res: any) => {
            if(res[status] === 200) {
              return 1
            } else {
              return 0
            }
          }
        );
      }
      return null;
    }


    // public dataToLocal(data): Observable<any> {
    //   this.database.createQuery(data);
    //   return null;
    // }

    public callToExternalService(serviceName, serviceType, urlOption): Observable<any> {
      return this.makeHttpCall(serviceName, serviceType, urlOption)
    }

    // Make http get post call  
    public makeHttpCall(serviceName, serviceType, urlOption?: UrlOptions): Observable<any> {
        const headers = new HttpHeaders({});
        if (urlOption && urlOption.contentType) {
          headers.append('Content-Type', urlOption.contentType);
        } else {  }
    
        const options: any = { headers };
    
        if (serviceType === ServiceType.GET) {
          if (urlOption && urlOption.pathParam != null) {
              serviceName = serviceName + urlOption.pathParam;
          }
          if (urlOption && urlOption.queryParams != null) {
              options.params = urlOption.queryParams;
          }
    
          console.log("HTTP GET Call...");
          return this.httpClient.get(serviceName, options).
                  pipe(map((res) => {
                      return res;
                  }));
        } else if (serviceType === ServiceType.POST) {
          if (urlOption && urlOption.body) {
            const optionBody  = urlOption.body;
            console.log("HTTP POST Call...");
            return this.httpClient.post(`${ServletURL.baseUrl}/${serviceName}`, optionBody)
              .pipe(
                catchError(this.handleError)
              );
          }
        }
      }
    
      // Error handling of http call
      private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          console.error('Backend returned code ${error.status}, ' + 'body was: ${error.error}');
        }
        return throwError('Something bad happened; please try again later.');
      }




}