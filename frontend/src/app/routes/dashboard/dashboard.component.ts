import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { isExpressionWithTypeArguments } from 'typescript';
import { HttpService } from '@core';
import { AccountingService } from '@core/services/httpServices/accounting.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    `
      .mat-raised-button {
        margin-right: 8px;
        margin-top: 8px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  chart1 = null;
  chartofaccountbalancetotal={};

  constructor(
    private ngZone: NgZone,
    private accountingService:AccountingService,
    
  ) {}

  ngOnInit() {
    this.initpage();
  }

  ngAfterViewInit() {
   // this.ngZone.runOutsideAngular(() => this.initChart());
  }

  ngOnDestroy() {
    if (this.chart1) {
      this.chart1.destroy();
    }
  }

  initChart(series,dates) {
    this.chart1 = new ApexCharts(document.querySelector('#chart1'), {
      chart: {
        height: 350,
        type: 'area',
        toolbar: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      series: series,
      xaxis: {
        type: 'datetime',
        categories: dates,
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy',
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
      },
    });
    this.chart1.render();
  }
  async initpage(){
    var result = await this.accountingService.accountingdashboarddataget();
    if(result['status']=="success"){
      //this.chartofaccountbalancetotal = result['data']['chartofaccountbalancetotal']
     console.log(result['data']['chartofaccountbalancepastsevendays'])
      if(Object.keys(result['data']['chartofaccountbalancepastsevendays']).length!=0){
        var possevedaysdales = (result['data']['chartofaccountbalancepastsevendays'])['pos sale']; 
      var dates = [];
      var series = {name:'sale',data:[]};
      for (let index = 0; index < possevedaysdales.length; index++) {
        const element = possevedaysdales[index];
        dates.push(element.date);
        var amount = (element.amount>=0)?element.amount:-element.amount;
        
        series.data.push(amount)
      }
      this.ngZone.runOutsideAngular(() => this.initChart([series],dates));
      }
      
    }
  }
}
