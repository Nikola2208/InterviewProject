import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderCreation } from '../classes/OrderCreation';
import { OrderResponse } from '../classes/OrderResponse';
import { baseURL } from 'src/environments/environments';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  create(order: OrderCreation): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(baseURL.baseURL + 'order', order, httpOptions);
  }

  getAll(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(baseURL.baseURL + 'orders');
  }

  getAllApproved(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(baseURL.baseURL + 'approved-orders');
  }

  getByUser(userId: number): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(baseURL.baseURL + 'user/' + userId + '/orders');
  }

  delete(orderId: number) {
    return this.http.delete(baseURL.baseURL + 'order/' + orderId);
  }

  accept(orderId: number) {
    return this.http.get(baseURL.baseURL + 'order/' + orderId + '/accept');
  }

  reject(orderId: number) {
    return this.http.get(baseURL.baseURL + 'order/' + orderId + '/reject');
  }

  createPDF(orderId: number) {
    return this.http.post(baseURL.baseURL + 'order/' + orderId + '/pdf', {location: "order.pdf"}, { responseType: 'blob' });
  }
}
