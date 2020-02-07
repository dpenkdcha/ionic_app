import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../shared/services/sales.service';
import { DatabaseService } from 'src/app/shared/services/database/database.service';
import { QueryFormater } from 'src/app/shared/constants/app.constant';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule  } from '@angular/forms';

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
    constructor(private database: DatabaseService,private formBuilder: FormBuilder) {


    }
    
    ngOnInit() {

        this.userForm = this.formBuilder.group({
            FNAME: ['', Validators.required],
            LNAME: ['', Validators.required],
            UNAME: ['', Validators.required]
        });

        this.formateQuery = JSON.parse(QueryFormater.SELECT)
        this.formateQuery.TABLE = 'USER';
        this.database.createQuery(this.formateQuery).subscribe(res => {
            this.row_data = res['data'];
        });

    //     this.salesService.getSales().subscribe((res: any) => {
    //         var config = {
    //             aggregatorName:"Count",
    //             rendererName:"Bar Chart", 
    //             rows:["Customer Name"],
    //             cols:["Product Code"],
    //             inclusions:{},
    //             vals:[],
    //             data:  res.data,
    //             control:true,
    //             renderers :$.extend($.pivotUtilities.renderers,$.pivotUtilities.c3_renderers),
    //             title:"",
    //             accordian:false
    //         };
    //        let object = $("#mychart").pivotUI(config.data, {
    //             control:config.control,
    //             renderers: config.renderers,
    //             "aggregatorName":config.aggregatorName,"rendererName":config.rendererName,"rows":config.rows,"cols":config.cols,"vals":config.vals,"inclusions":config.inclusions
    //         });
     
    //         //aggregator: sumOverSum(["tip", "total_bill"]),
            
    //         let object1 = $("#mychart1").pivot(config.data, {
    //             renderer: $.pivotUtilities.c3_renderers["Pie Chart"],
    //             aggregator:$.pivotUtilities.aggregators["Count"](),
    //             //renderers: $.extend($.pivotUtilities.renderers,$.pivotUtilities.c3_renderers),
    //             "rows":config.rows,"cols":config.cols,"vals":config.vals,"inclusions":config.inclusions
    //         });
    //       }, err => {
    //         console.log(err);
    //       });
        
    } 
    
    onDataSave() {
        if(this.userForm.valid) {
            this.formateQuery = JSON.parse(QueryFormater.INSERT)
            this.formateQuery.TABLE = 'USER';
            this.formateQuery.INSERT = this.userForm.value;
            this.database.createQuery(this.formateQuery);
        } else {
            alert("Please Fill Valid Data");
        }
    }

    deleteRow(userData) {
        this.formateQuery = JSON.parse(QueryFormater.DELETE)
        this.formateQuery.TABLE = 'USER';
        this.formateQuery.WHERE = {"AND":[{"KEY":"FNAME","SEPERATOR":"=","VALUE":userData.FNAME},{"KEY":"LNAME","SEPERATOR":"=","VALUE":userData.LNAME},{"KEY":"UNAME","SEPERATOR":"=","VALUE":userData.UNAME}]};
        this.database.createQuery(this.formateQuery);
    }

}
