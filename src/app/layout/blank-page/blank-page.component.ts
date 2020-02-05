import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../shared/services/sales.service';

declare var $: any; 
@Component({
    selector: 'app-blank-page',
    templateUrl: './blank-page.component.html',
    styleUrls: ['./blank-page.component.scss']
})
export class BlankPageComponent implements OnInit {
    constructor(private salesService: SalesService) {


    }
    
    ngOnInit() {

        this.salesService.getSales().subscribe((res: any) => {
            var config = {
                aggregatorName:"Count",
                rendererName:"Bar Chart", 
                rows:["Customer Name"],
                cols:["Product Code"],
                inclusions:{},
                vals:[],
                data:  res.data,
                control:true,
                renderers :$.extend($.pivotUtilities.renderers,$.pivotUtilities.c3_renderers),
                title:"",
                accordian:false
            };
           let object = $("#mychart").pivotUI(config.data, {
                control:config.control,
                renderers: config.renderers,
                "aggregatorName":config.aggregatorName,"rendererName":config.rendererName,"rows":config.rows,"cols":config.cols,"vals":config.vals,"inclusions":config.inclusions
            });
     
            //aggregator: sumOverSum(["tip", "total_bill"]),
            
            let object1 = $("#mychart1").pivot(config.data, {
                renderer: $.pivotUtilities.c3_renderers["Pie Chart"],
                aggregator:$.pivotUtilities.aggregators["Count"](),
                //renderers: $.extend($.pivotUtilities.renderers,$.pivotUtilities.c3_renderers),
                "rows":config.rows,"cols":config.cols,"vals":config.vals,"inclusions":config.inclusions
            });
          }, err => {
            console.log(err);
          });
        
    } 
}
