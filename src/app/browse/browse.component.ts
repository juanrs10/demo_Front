import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../user/userData.service';
import { User } from '../user/user';
import { Observable , of, BehaviorSubject } from 'rxjs';
import { Query } from '../query/query';
import { QueryService } from '../query/query.service';
import { Router } from '@angular/router';
import { Comment } from '../comment/comment';
import { CommentService } from '../comment/comment.service';
import { map, switchMap } from 'rxjs/operators'; // Importa switchMap

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {

  constructor(private userDataService: UserDataService, private queryService: QueryService, private router:Router, private commentService: CommentService) { }

  user: User | null = this.userDataService.getCurrentUser();
  queriesDisplayed : Observable<Query[]> = of([]);
  comment: string = "";
  selectedQuery: any;

  //OBSERVABLES queryDetail y comments
  private queryDetailSubject = new BehaviorSubject<any>(null);
  queryDetail$: Observable<any> = this.queryDetailSubject.asObservable();
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  comments$: Observable<Comment[]> = this.commentsSubject.asObservable();
  

  displayQueries(){

    this.queriesDisplayed = this.queryService.getQueries();
    
  }

  displayQueryDetails(query: Query){

    this.selectedQuery = query;

    this.queryDetail$ = this.queryService.getQueryDetail(query); 
    console.log(this.queryDetail$);

    
  }

  uploadComment(query: Query, comment: string){

    // Comprueba si el comentario está vacío o si solo contiene espacios en blanco
    if (!comment || comment.trim().length === 0) {
      return; 
    }
    else{
      const newComment = new Comment(comment, null, null);
      this.commentService.createComment(this.user as User, query, newComment).subscribe(
        response => {
          console.log('Comentario creado:', response);
          console.log(this.comments$);

          // Actualiza los comentarios en tiempo real
          this.commentsSubject.next([...this.commentsSubject.value, response]);

          // Actualiza queryDetail en tiempo real usando switchMap
          this.queryDetail$ = this.queryDetail$.pipe(
            switchMap(queryDetail$ => {
              if (queryDetail$) {
                queryDetail$.comments.push(response);
              }
              return of(queryDetail$);
            })
          );
        },
        error => {
          console.error('Error al crear comentario:', error);
        }
      );
    }


  }

  ngOnInit() {

    this.displayQueries();
  }

  goHome(){
    this.router.navigate(["/homepage"])
  }


  navigateToSection(sectionId: string){
    document.getElementById(sectionId)?.scrollIntoView();
  }

}
