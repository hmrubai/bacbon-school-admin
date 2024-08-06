import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

import { UserGroupEntryComponent } from "./user-group-entry.component";
import { UserGroupEntryRoutes } from "./user-group-entry.routing";
import { SharedModule } from "../theme/shared/shared.module";


@NgModule({
  imports: [CommonModule, RouterModule.forChild(UserGroupEntryRoutes), SharedModule],
  declarations: [UserGroupEntryComponent],
})
export class UserGroupEntryModule {}
