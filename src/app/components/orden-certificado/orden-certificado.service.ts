import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdenCertificado } from './orden-certificado.model';
import { OrdenCertificadoDetalle } from './orden-certificado-detalle.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenCertificadoService {

  private baseUrl = 'http://localhost:8080/api/certificados';

  constructor(private http: HttpClient) {}

  obtenerCertificado(compania: string, numeroDoc: number): Observable<OrdenCertificado[]> {
    return this.http.get<OrdenCertificado[]>(`${this.baseUrl}/${compania}/${numeroDoc}`);
  }

  obtenerDetalle(compania: string, numeroDoc: number): Observable<OrdenCertificadoDetalle[]> {
    return this.http.get<OrdenCertificadoDetalle[]>(`${this.baseUrl}/detalle/${compania}/${numeroDoc}`);
  }
}
