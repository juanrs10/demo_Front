import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Observable} from "rxjs";
import {Query} from "./query";
import { Comment } from '../comment/comment';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  private apiUrl: string = environment.baseUrl + 'queries';


  constructor(private http: HttpClient) { }

  getQueries(): Observable<Query[]> {
    return this.http.get<Query[]>(this.apiUrl);
  }

  createQuery(userId: number | undefined, query: Query): Observable<any> {
    // Incluye el userId en la URL
    const url = `${this.apiUrl}/users/${userId}`;
    return this.http.post(url, query);
  }

  executeQuery(query: Query): Observable<any> {
    return this.http.post(this.apiUrl + "/execute", query);
  }

  getQueryDetail(query: Query): Observable<Query>{
    const url = `${this.apiUrl}/${query.id}`;
    return this.http.get<Query>(url);
  }

  commentQuery(query: Query, content: string){
  }

}
