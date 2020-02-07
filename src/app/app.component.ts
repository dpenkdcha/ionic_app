import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './shared/services/database/database.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private databaseService: DatabaseService) {
    }

    ngOnInit() {
        
    }
}
