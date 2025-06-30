import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdenTrabajoDetalle } from './orden-trabajo.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenTrabajoService {
  private baseUrl = 'http://localhost:8080/api/ordenes-trabajo';

  constructor(private http: HttpClient) {}

  obtenerDetallePorId(idOt: string): Observable<OrdenTrabajoDetalle[]> {
    return this.http.get<OrdenTrabajoDetalle[]>(`${this.baseUrl}/detalle/${idOt}`);
  }

  actualizarComentario(idOt: string, comentario: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/comentario/${idOt}`, { comentario });
  }
}