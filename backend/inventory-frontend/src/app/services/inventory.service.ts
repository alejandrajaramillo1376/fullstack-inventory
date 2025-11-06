import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'http://localhost:5000/api/items'; // ⚠️ Usa el puerto donde corre tu backend (5000 si es Express)

@Injectable({ providedIn: 'root' })
export class InventoryService {
  constructor(private http: HttpClient) {}

  getItems(params?: any): Observable<any> {
    return this.http.get(BASE, { params });
  }

  create(item: any) {
    return this.http.post(BASE, item);
  }

  move(id: string, payload: any) {
    return this.http.post(`${BASE}/${id}/move`, payload);
  }
}