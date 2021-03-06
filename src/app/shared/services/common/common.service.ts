import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ServletURL, ServiceType, UrlOptions, IdentifyPlatform } from '../../constants/app.constant';
import { Platform } from '@ionic/angular';
import { DatabaseService } from '../database/database.service';
import { PopupService } from '../popup/popup.service';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private platform: Platform,
    private httpClient: HttpClient,
    private databaseService: DatabaseService,
    private popupService: PopupService
  ) { 
    
  }

  
  // Check connection if online or offline
  public checkConnnection() {
    return navigator.onLine;
  }

  // Check platform
  public checkPlatform() {
    if (this.platform.is("android")) {
      return IdentifyPlatform.Android;
    } else if (this.platform.is("ios")) {
      return IdentifyPlatform.IOS;
    } else {
      return IdentifyPlatform.Web;
    }
  }

  // 
  public callService(serviceName, urlOption, query): Observable<any> {
    return new Observable((resolve) => {
      if (this.platform.is("android") || this.platform.is("ios")) {
        this.databaseService.createQuery(query).subscribe(
          (res: any) => {
            if (this.checkConnnection() && res['status'] === 200 && serviceName != '') {
              this.callToExternalService(serviceName, urlOption).subscribe((res: any) => {
                resolve.next(res);
              });
            } else if (res['status'] === 200) {
              this.databaseService.createQuery(query).subscribe(//update flag
                (res: any) => {
                  if(res['status'] === 200) {
                    resolve.next(res);
                  } else {
                    //show flag update false flag
                  }
                }
              )
            } else {
              this.popupService.openPopup('iRecruit' ,"Flag updation failed",["Ok"]).subscribe(
                (res: any) => {
                  if(res === 'Ok'){
                    return;
                  }
                }
              )
            }
          }
        )
      } else if(serviceName && urlOption) {
        this.callToExternalService(serviceName, urlOption).subscribe((res: any) => {
          resolve.next(res);
        });
      } else{
        this.popupService.openPopup('iRecruit' ,"Exteranl service failed",["Ok"]).subscribe(
          (res: any) => {
            if(res === 'Ok'){
              return;
            }
          }
        )
      }
    });
  }

  private callToExternalService(serviceName, urlOption): Observable<any> {
    return new Observable((resolve) => {
      this.makeHttpCall(serviceName, urlOption).subscribe(
        (res: any) => {
          if (res['status'] === 200) {
            resolve.next(res['data']);
          }
        },
        (error: any) => {
          this.popupService.openPopup('iRecruit' ,"Exteranl service failed",["Ok"]).subscribe(
            (res: any) => {
              if(res === 'Ok'){
                return;
              }
            }
          )
        }
      )
    })
  }

  // Make http get post call  
  private makeHttpCall(serviceName, urlOption?: UrlOptions): Observable<any> {
    const headers = new HttpHeaders({});
    if (urlOption && urlOption.contentType) {
      headers.append('Content-Type', urlOption.contentType);
    } else { }

    const options: any = { headers };

    if (urlOption && urlOption.body) {
      const optionBody = urlOption.body;
      console.log("HTTP POST Call...");
      return this.httpClient.post(`${ServletURL.baseUrl}/${serviceName}`, optionBody)
        .pipe(
          catchError(this.handleError)
        );
    } else {
      return 
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