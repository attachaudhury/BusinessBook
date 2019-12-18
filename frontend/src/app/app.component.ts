import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PreloaderService, HttpService } from '@core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private preloader: PreloaderService,private httpService: HttpService) {}

  ngOnInit() {
    this.httpService.autoAuthUser();
  }

  ngAfterViewInit() {
    this.preloader.hide();
  }
}
