import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class SpinnerService {
    private static visible: boolean;
    private static config:any = {"size":"3rem","color":"#1574b3","bgColor":"#FFF"};
    constructor() { }

    @Output() static change: EventEmitter<any> = new EventEmitter();

    public static toggle() {
        this.visible = !this.visible;
        this.change.emit({"config":this.config,"_isVisible":this.visible});
    }

    public static show() {
        this.visible = true;
        console.log(this.visible);
        this.change.emit({"config":this.config,"_isVisible":this.visible});
    }

    public static hide() {
        this.visible = false;
        console.log(this.visible);
        this.change.emit({"config":this.config,"_isVisible":this.visible});
    }

}