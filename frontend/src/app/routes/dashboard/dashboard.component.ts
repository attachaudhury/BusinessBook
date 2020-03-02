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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  chart1 = null;
  chartofaccountbalancetotal={};
  chartofaccountbalancepastsevendays={};


  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private httpService:HttpService
  ) {}

  ngOnInit() {
    this.initpage();
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => this.initChart());
  }

  ngOnDestroy() {
    if (this.chart1) {
      this.chart1.destroy();
    }
  }

  initChart() {
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
      series: [
        {
          name: 'Sale',
          data: [31, 40, 28, 51, 42, 109, 100],
        },
        {
          name: 'Purchase',
          data: [11, 32, 45, 32, 34, 52, 41],
        },
      ],
      xaxis: {
        type: 'datetime',
        categories: [
          '2019-11-24T00:00:00',
          '2019-11-24T01:30:00',
          '2019-11-24T02:30:00',
          '2019-11-24T03:30:00',
          '2019-11-24T04:30:00',
          '2019-11-24T05:30:00',
          '2019-11-24T06:30:00',
        ],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
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
    this.httpService.accountingdashboarddataget().then(result=>{
      console.log('dashboard data');
      console.log(result);
      if(result['status']=="success"){
        this.chartofaccountbalancetotal = result['data']['chartofaccountbalancetotal']
        this.chartofaccountbalancepastsevendays = result['data']['chartofaccountbalancepastsevendays']
      }
    })
  }
}
