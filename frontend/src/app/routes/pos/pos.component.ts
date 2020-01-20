import { Component, OnInit, } from '@angular/core';

import { HttpService } from '@core';
import { product } from '@shared/models/product';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styles: [
    `
      .mat-raised-button {
        margin-right: 8px;
        margin-top: 8px;
      }
    `,
  ],
})
export class PosComponent implements OnInit {
  searchtextcontrol = new FormControl();
  filteredproducts: product[] = [];
  products: product[] = [];
  cart: product[] = [];
  carttotal:number=0.0;
  selectedproduct:product=null;
  constructor(private httpservice: HttpService, ) {

  }
  ngOnInit() {
    this.getpagedata();
    this.searchtextcontrol.valueChanges.subscribe(val => {
      this.selectedproduct = null;
      var tmpproducts = this.products.filter(el => {
        if (el.name.toLowerCase().includes(val.toLowerCase())) {
          return el;
        }
      })
      this.filteredproducts = tmpproducts.splice(0, 5);
    })
  }
  getpagedata() {
    this.httpservice.productget().then(res => {
      if (res["status"] == "success") {
        this.products = res["data"];
      }
    });
  }
  searchtextcontrolselectedoption(event: any) {
    this.selectedproduct = null;
    const selectedValue = event.option.value;
    for (let index = 0; index < this.filteredproducts.length; index++) {
      const product = this.filteredproducts[index];
      if (product.name == selectedValue) {
        var tmpproduct = { _id: product._id, name: product.name, barcode: product.barcode, saleprice: product.saleprice, quantity: 1, total: product.saleprice };
        this.selectedproduct = tmpproduct;
         break;
      }
    }
  }
  searchtextcontrolkeydown(eventkey){
    if(eventkey=="Enter" && this.selectedproduct!=null)
    {
      this.addproducttocart(this.selectedproduct);
    }
  }
  addproducttocart(product: product) {
    var tmpproduct = { _id: product._id, name: product.name, barcode: product.barcode, saleprice: product.saleprice, quantity: 1, total: product.saleprice };
    this.selectedproduct = tmpproduct;
    for (let index = 0; index < this.cart.length; index++) {
      const element = this.cart[index];
      if (element._id == tmpproduct._id) {
        element.quantity += 1;
        element['total'] = element.quantity * element.saleprice;
        this.cart = [...this.cart];
        this.updatecarttotal();
        return false;
      }
    }
    this.cart.push(tmpproduct);
    this.cart = [...this.cart];
    this.updatecarttotal();
  }
  updatecarttotal(){
    var tmptotal = 0.0;
    this.cart.map(el=>{tmptotal+=el['total']});
    this.carttotal= tmptotal;
  }
}