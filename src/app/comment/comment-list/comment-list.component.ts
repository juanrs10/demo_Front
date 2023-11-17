import { Component, OnInit } from '@angular/core';
import { CommentService } from '../comment.service';

@Component({
  selector: 'app-commment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

  comments: Array<Comment> = [];

  constructor(private commentService: CommentService) { }

  getComments(): void {
    this.commentService.getComments().subscribe((comments) => {
      this.comments = comments;
    });
  }

  ngOnInit() {
    this.getComments;
  }

}
