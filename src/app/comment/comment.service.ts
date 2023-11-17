import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl: string = environment.baseUrl + 'comments';

  constructor(private http: HttpClient) { }

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl);
  }

}
