export interface financetransaction{
  _id?:string;
  amount?:number;
  createdata?:Date;
  description?:string;
  financeaccount?:any;
  group?:any;
  others?:financetransactionothersmodel[];
  soldproducts?:any;
  status?:number;
  user?:any;
}
export interface financetransactionothersmodel{
  key?:string;
  value?:string;
}
