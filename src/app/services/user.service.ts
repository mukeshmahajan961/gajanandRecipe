import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  api_url = "http://localhost:3000/users";
  constructor(private http: HttpClient) { }

  getUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(this.api_url);
  }

  getUsersById(id: string): Observable<Users> {
    return this.http.get<Users>(this.api_url + "/" + id);
  }

  addUsers(Users: Users): Observable<string> {
    return this.http.post<string>(this.api_url, Users);
  }

  updateUsers(id: string, Users: Users): Observable<boolean> {
    return this.http.put<boolean>(this.api_url + "/" + id, Users)
  }

  deleteUsers(id: string): Observable<boolean> {
    return this.http.delete<boolean>(this.api_url + "/" + id);
  }
}
