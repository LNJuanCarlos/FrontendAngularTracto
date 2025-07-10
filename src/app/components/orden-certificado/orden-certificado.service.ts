import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdenCertificado } from './orden-certificado.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenCertificadoService {

  private baseUrl = 'http://localhost:8080/api/certificados';

  constructor(private http: HttpClient) {}

  obtenerCertificado(compania: string, numeroDoc: number): Observable<OrdenCertificado[]> {
    return this.http.get<OrdenCertificado[]>(`${this.baseUrl}/${compania}/${numeroDoc}`);
  }
}
