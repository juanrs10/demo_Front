import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Utiliza solo la ruta relativa
  // private apiUrl: string = '/api/users';

  private apiUrl: string = environment.baseUrl + 'users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  postUser(user: User): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

}
