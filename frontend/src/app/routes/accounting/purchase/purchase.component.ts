import { Component, OnInit, } from '@angular/core';

import { HttpService } from '@core';
import { product } from '@shared/models/product';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pos',
  templateUrl: './purchase.component.html',
  styles: [
    `
      .mat-raised-button {
        margin-right: 8px;
        margin-top: 8px;
      }
    `,
  ],
})
export class PurchaseComponent implements OnInit {
  searchtextcontrol = new FormControl();
  searchtextcontrolvaluechangesubsscription: Subscription;
  filteredproducts: product[] = [];
  products: product[] = [];
  cart: product[] = [];
  carttotal: number = 0.0;
  scanningmode = false;
  selectedproduct: product = null;
  constructor(private httpservice: HttpService, private matsnackbar: MatSnackBar) {

  }
  ngOnInit() {
    this.getpagedata();
    this.changesearchmode({ checked: false });
  }
  changesearchmode(event) {
    this.scanningmode = event.checked;
    if (this.scanningmode) {
      this.searchtextcontrolvaluechangesubsscription.unsubscribe();
      this.filteredproducts = []
    }
    else {
      this.searchtextcontrolvaluechangesubsscription = this.searchtextcontrol.valueChanges.subscribe(val => {
        this.selectedproduct = null;
        var tmpproducts = this.products.filter(el => {
          if (el.name.toLowerCase().includes(val.toLowerCase())) {
            return el;
          }
        })
        this.filteredproducts = tmpproducts.splice(0, 5);
      })
    }
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
        var tmpproduct = { _id: product._id, name: product.name, barcode: product.barcode, purchaseprice: product.purchaseprice, quantity: 1, total: product.purchaseprice };
        this.selectedproduct = tmpproduct;
        break;
      }
    }
  }
  async searchtextcontrolkeydown(eventkey) {
    if (this.scanningmode && eventkey=="Enter") {
      console.log(this.searchtextcontrol.value);
      for (let i = 0; i < this.products.length; i++) {
        let element = this.products[i];
        if(this.searchtextcontrol.value == element.barcode)
        {
          this.addproducttocart(element);
          break;
        }
      }
    }
    else {
      if (eventkey == "Enter" && this.selectedproduct != null) {
        console.log(eventkey);
        this.addproducttocart(this.selectedproduct);
      }
      else if (eventkey == "Delete" && this.selectedproduct != null) {
        console.log(eventkey);
        this.deleteproductfromcart(this.selectedproduct);
      }
      else if (eventkey == "Shift" && this.selectedproduct != null) {
        console.log(eventkey);
      }
      else if (eventkey == "End" && this.cart.length > 0) {
        this.matsnackbar.open('Sale in process', 'Close', {duration:2000})
        var salestatus = await this.httpservice.accountingpossalenew({ list: this.cart })
        console.log(salestatus);
        if(salestatus['status']=='success')
        {
          this.matsnackbar.open('Sale successfully', 'Close', {duration:5000});
          this.cart=[];
          this.updatecarttotal();
        }
        else{
          this.matsnackbar.open('Sale Failed', 'Close', {duration:5000})
        }
      }
    }

  }
  addproducttocart(product: product) {
    this.selectedproduct = product;
    for (let index = 0; index < this.cart.length; index++) {
      const element = this.cart[index];
      if (element._id == product._id) {
        element.quantity += 1;
        element['price'] = element['price'];
        element['total'] = element.quantity * element['price'];
        this.cart = [...this.cart];
        this.updatecarttotal();
        return false;
      }
    }
    product.quantity=1;
    product['price'] = product.purchaseprice;
    product['total'] = product.purchaseprice;
    this.cart.push(product);
    this.cart = [...this.cart];
    this.updatecarttotal();
  }
  deleteproductfromcart(product: product) {
    for (let index = 0; index < this.cart.length; index++) {
      const element = this.cart[index];
      if (element._id == product._id) {
        var tmpcart = [...this.cart];
        tmpcart.splice(index, 1)
        this.cart = [...tmpcart];
        this.updatecarttotal();
        break;
      }
    }
  }
  updatecarttotal() {
    var tmptotal = 0.0;
    this.cart.map(el => { tmptotal += el['total'] });
    this.carttotal = tmptotal;
  }
}
