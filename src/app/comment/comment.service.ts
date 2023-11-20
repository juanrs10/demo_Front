import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from "rxjs";
import { Comment } from './comment';
import { User } from '../user/user';
import { Query } from '../query/query';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl: string = environment.baseUrl + 'comments';

  constructor(private http: HttpClient) { }

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl);
  }

  createComment(user: User, query: Query, comment: Comment): Observable<any>{
    console.log(user.id)
    console.log(query.id)
    console.log(comment)
    console.log(`${this.apiUrl}/users/${user.id}/queries/${query.id}`)
    return this.http.post(`${this.apiUrl}/users/${user.id}/queries/${query.id}`, comment);
  }

}
