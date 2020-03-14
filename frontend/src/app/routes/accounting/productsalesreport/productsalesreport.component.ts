import { Component, OnInit, Inject } from '@angular/core';
import { product } from '@shared/models/product';
import { AccountingService } from '@core/services/httpServices/accounting.service';
import { ProductService } from '@core';
@Component({
  selector: 'app-accounting-productsalesreport',
  templateUrl: './productsalesreport.component.html',
})
export class ProductSalesReportComponent implements OnInit {
  products: product[];
  report = []
  searchmodel = {product:undefined,fromdate:undefined,todate:undefined}
  constructor(private accountingService: AccountingService, private productService: ProductService) { }
  ngOnInit() {
    this.getpagedata();
  }
  async getpagedata() {
    this.productService.productget().then(res => {
      console.log('loaded getpagedata');
      console.log(res);
      if (res["status"] == "success") {
        this.products = res["data"];
      }
    });
  }
  async search()
  {
    var result=await this.accountingService.accountingproductsalesreportget(this.searchmodel);
    console.log('sale repost')
    console.log(result);
    if(result['status']=="success"){
      this.report = result['data'];
    }
  }
}

