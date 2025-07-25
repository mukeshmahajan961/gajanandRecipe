import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  api_url = "https://localhost:7196/api/Contact";
  constructor(private http: HttpClient) { }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.api_url);
  }

  getContactsById(id: number): Observable<Contact> {
    return this.http.get<Contact>(this.api_url + "/" + id);
  }

  sendMessage(Contacts: Contact): Observable<number> {
    return this.http.post<number>(this.api_url, Contacts);
  }

  updateContacts(id: number, Contacts: Contact): Observable<boolean> {
    return this.http.put<boolean>(this.api_url + "/" + id, Contacts)
  }

  deleteContacts(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.api_url + "/" + id);
  }
}
