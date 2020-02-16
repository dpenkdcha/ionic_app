import { Injectable } from '@angular/core';

declare let gtag: Function;
declare global {
    interface Window { dataLayer: any; }
}
window.dataLayer = window.dataLayer || [];

@Injectable({
    providedIn: 'root'
})
export class GoogleAnalyticsService {

}
