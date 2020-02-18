import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { ReactiveFormsModule } from '@angular/forms';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { PopupComponent } from './shared/modules/popup/popup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PopupModule } from './shared/modules/popup/popup.module';


@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        IonicModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientModule,
        LanguageTranslationModule,
        AppRoutingModule,
        ReactiveFormsModule,
        NgbModule,
        PopupModule 
    ],
    declarations: [AppComponent],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        AuthGuard,
        SQLite
    ],
    entryComponents: [PopupComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
