export interface product{
  _id?:string;
  barcode?:string;
  categories?:string[];
  carrycost?:number;
  discount?:number;
  description?:string;
  images?:string[];
  name?:string;
  purchaseprice?:number;
  purchaseactive?:boolean;
  quantity?:number;
  saleprice?:number;
  saleactive?:boolean;
  subproduct?:any;
  type?:string;
}
