import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner/spinner.service';
//import { ISpinnerAnimation } from '../ngx-spinner.types';

@Component({
    selector: 'spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'] 
})
export class SpinnerComponent {
    private config = {};
    private _isVisible: boolean;

    constructor() { }

    ngOnInit() {
        SpinnerService.change.subscribe(result => {
            console.log(result);
            this.config = result.config;
            this._isVisible = result._isVisible;
        });
    }

}
