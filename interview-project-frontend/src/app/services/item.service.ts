import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseURL } from 'src/environments/environments';
import { ItemCreation } from '../classes/ItemCreation';
import { ItemResponse } from '../classes/ItemResponse';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  create(item: ItemCreation): Observable<ItemResponse> {
    return this.http.post<ItemResponse>(baseURL.baseURL + 'item', item, httpOptions);
  }

  getAll(): Observable<ItemResponse[]> {
    return this.http.get<ItemResponse[]>(baseURL.baseURL + 'items');
  }

  update(itemId: number, item: ItemCreation): Observable<ItemResponse> {
    return this.http.put<ItemResponse>(baseURL.baseURL + 'item/' + itemId, item, httpOptions);
  }

  delete(itemId: number) {
    return this.http.delete(baseURL.baseURL + 'item/' + itemId);
  }
}
