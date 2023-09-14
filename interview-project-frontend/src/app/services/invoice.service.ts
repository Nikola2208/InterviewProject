import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InvoiceCreation } from '../classes/InvoiceCreation';
import { Observable } from 'rxjs';
import { InvoiceResponse } from '../classes/InvoiceResponse';
import { baseURL } from 'src/environments/environments';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  create(invoice: InvoiceCreation, orderId: number): Observable<InvoiceResponse> {
    return this.http.post<InvoiceResponse>(baseURL.baseURL + 'order/' + orderId + '/invoice', invoice, httpOptions);
  }

  getAll(): Observable<InvoiceResponse[]> {
    return this.http.get<InvoiceResponse[]>(baseURL.baseURL + 'invoices');
  }

  getByUser(userId: number): Observable<InvoiceResponse[]> {
    return this.http.get<InvoiceResponse[]>(baseURL.baseURL + 'user/' + userId + '/invoices');
  }

  delete(invoiceId: number) {
    return this.http.delete(baseURL.baseURL + 'invoice/' + invoiceId);
  }
}
