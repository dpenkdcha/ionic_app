import { Injectable } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PopupComponent } from '../../modules/popup/popup.component';
import { PopupFormater } from '../../constants/app.constant';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class PopupService {
    closeResult: string;
    modalData: any = {};
    PopupConfig: any = {'backdrop': 'static', 'keyboard': false, 'size': 'xl'};
    PopupType: string = 'default';

    constructor(private modalService: NgbModal) {}
        
    public openPopup(title: string, body: string, button: Array<string>, type?: string, config?: any){
        this.modalData = JSON.parse(PopupFormater.Popup);
        this.modalData.HEADER = title;
        this.modalData.BODY = body;
        this.modalData.BUTTON = button;
        this.modalData.TYPE = (!!type ? type : this.PopupType);
        //this.PopupConfig = (!!config ? config : this.PopupConfig)
        if(!!config) {
            for (var key in config) {
                this.PopupConfig[key] = config[key];
            }
        }
        console.log(this.PopupConfig);
        const modelRef = this.modalService.open(PopupComponent, this.PopupConfig);
        modelRef.componentInstance.modalData = this.modalData;
        return new Observable((observe) => {
            modelRef.result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
                observe.next(result);
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                observe.next(this.closeResult);
            });
        })
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }
}