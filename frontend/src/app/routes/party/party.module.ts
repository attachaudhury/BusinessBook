import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoutingModule } from './routing.module';

import { CustomerAddComponent } from './customeradd/customeradd.component';
import { CustomerListComponent } from './customerlist/customerlist.component';
import { CustomerEditComponent } from './customeredit/customeredit.component';

const COMPONENTS = [CustomerAddComponent, CustomerListComponent,CustomerEditComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [SharedModule, RoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class PartyModule {}
