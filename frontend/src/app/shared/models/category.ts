export interface category {
  _id?: string;
  name?: string;
  path?: string;
  parentId?:string;
  children:category[];
}
