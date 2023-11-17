import { Injectable, Query } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  private apiUrl: string = environment.baseUrl + 'queries';


  constructor(private http: HttpClient) { }

  getQueries(): Observable<Query[]> {
    return this.http.get<Query[]>(this.apiUrl);
  }

}
