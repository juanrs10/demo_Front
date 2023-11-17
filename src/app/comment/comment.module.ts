import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentListComponent } from './comment-list/comment-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [CommentListComponent],
  declarations: [CommentListComponent]
})
export class CommentModule { }
