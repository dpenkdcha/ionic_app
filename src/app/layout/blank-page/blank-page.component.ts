import { Component, OnInit } from '@angular/core';
import { QueryFormater } from 'src/app/shared/constants/app.constant';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule  } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common/common.service';

declare var $: any; 
@Component({
    selector: 'app-blank-page',
    templateUrl: './blank-page.component.html',
    styleUrls: ['./blank-page.component.scss']
})
export class BlankPageComponent implements OnInit {
    formateQuery: any = {};
    userForm:FormGroup;
    row_data:Array<any> = [];
    constructor(
        private formBuilder: FormBuilder,
        private commonservice: CommonService
    ) {

    }
    
    ngOnInit() {

        this.userForm = this.formBuilder.group({
            FNAME: ['', Validators.required],
            LNAME: ['', Validators.required],
            UNAME: ['', Validators.required]
        });

        this.loadExistingData();
    } 

    loadExistingData() {
        this.formateQuery = JSON.parse(QueryFormater.SELECT)
        this.formateQuery.TABLE = 'USER';
        this.commonservice.callService("", this.formateQuery, this.formateQuery).subscribe(
            (res: any) => {
                this.row_data = res['data'];
            }
        )
    }
    
    onDataSave() {
        if(this.userForm.valid) {
            this.formateQuery = JSON.parse(QueryFormater.INSERTORUPDATE)
            this.formateQuery.TABLE = 'USER';
            this.formateQuery.INSERTORUPDATE = this.userForm.value;
            this.formateQuery.WHERE = {"AND":[{"KEY":"FNAME","SEPERATOR":"=","VALUE":this.userForm.value.FNAME}]};
            this.commonservice.callService("", this.formateQuery, this.formateQuery).subscribe(res => {
                this.formateQuery = JSON.parse(QueryFormater.INSERT)
                this.formateQuery.TABLE = 'USER';
                this.formateQuery.INSERT = this.userForm.value;
                this.commonservice.callService("", this.formateQuery, this.formateQuery).subscribe(res => {

                });
                this.formateQuery = JSON.parse(QueryFormater.UPDATE)
                this.formateQuery.TABLE = 'USER';
                this.formateQuery.UPDATE = this.userForm.value;
                this.formateQuery.WHERE = {"AND":[{"KEY":"FNAME","SEPERATOR":"=","VALUE":this.userForm.value.FNAME}]};
                this.commonservice.callService("", this.formateQuery, this.formateQuery).subscribe(res => {

                });
                this.loadExistingData();
            });
        } else {
            alert("Please Fill Valid Data");
        }
    }

    deleteRow(userData) {
        this.formateQuery = JSON.parse(QueryFormater.DELETE)
        this.formateQuery.TABLE = 'USER';
        this.formateQuery.WHERE = {"AND":[{"KEY":"FNAME","SEPERATOR":"=","VALUE":userData.FNAME},{"KEY":"LNAME","SEPERATOR":"=","VALUE":userData.LNAME},{"KEY":"UNAME","SEPERATOR":"=","VALUE":userData.UNAME}]};
        this.commonservice.callService("", this.formateQuery, this.formateQuery).subscribe(
            (res: any) => {
                this.loadExistingData();
            }
        )
    }

}
