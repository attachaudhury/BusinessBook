import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CategoryRoutingModule } from './category-routing.module';

import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';

const COMPONENTS = [AddComponent, ListComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [SharedModule, CategoryRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class CategoryModule {}
