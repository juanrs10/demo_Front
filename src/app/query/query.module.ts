import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryListComponent } from './query-list/query-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [QueryListComponent],
  declarations: [QueryListComponent]
})
export class QueryModule { }
