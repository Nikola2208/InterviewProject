import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseURL } from 'src/environments/environments';
import { StackResponse } from '../classes/StackResponse';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class StackService {

  constructor(private http: HttpClient) { }

  create(orderId: number): Observable<StackResponse[]> {
    return this.http.get<StackResponse[]>(baseURL.baseURL + 'order/' + orderId + '/stack');
  }

  getAll(): Observable<StackResponse[]> {
    return this.http.get<StackResponse[]>(baseURL.baseURL + 'stacks');
  }
}
