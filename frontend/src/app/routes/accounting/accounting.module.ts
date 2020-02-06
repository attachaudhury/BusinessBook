import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoutingModule } from './routing.module';

import { PosSalesListComponent } from './possaleslist/possaleslist.component';

const COMPONENTS = [ PosSalesListComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [SharedModule, RoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class AccountingModule {}
