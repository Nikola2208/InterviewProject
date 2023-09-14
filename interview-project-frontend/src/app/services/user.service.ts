import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from 'src/environments/environments';
import { UserRegistration } from '../classes/UserRegistration';
import { Observable } from 'rxjs';
import { UserResponse } from '../classes/UserResponse';
import { Token } from '../classes/Token';
import { UserLogin } from '../classes/UserLogin';
import { Address } from '../classes/Address';
import { Email } from '../classes/Email';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  registration(user:UserRegistration): Observable<UserResponse> {
    return this.http.post<UserResponse>(baseURL.baseURL + 'register', user, httpOptions);
  }

  login(user:UserLogin): Observable<Token> {
    return this.http.post<Token>(baseURL.baseURL + 'login', user, httpOptions)
  }

  getAll(): Observable<UserResponse[]>{
    return this.http.get<UserResponse[]>(baseURL.baseURL + 'users')
  }
  
  getUserInfo(userId:number): Observable<UserResponse> {
    return this.http.get<UserResponse>(baseURL.baseURL + 'user/' + userId)
  }

  updateAddress(userId:number, address: Address): Observable<UserResponse> {
    return this.http.put<UserResponse>(baseURL.baseURL + 'user/' + userId + '/address', address, httpOptions)
  }

  updateEmail(userId:number, email: Email): Observable<UserResponse> {
    return this.http.put<UserResponse>(baseURL.baseURL + 'user/' + userId + '/account', email, httpOptions)
  }

  delete(userId: number){
    return this.http.delete(baseURL.baseURL + 'user/' + userId)
  }
}
