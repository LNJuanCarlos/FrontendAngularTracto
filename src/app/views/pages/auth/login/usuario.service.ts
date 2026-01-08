import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  cambiarClave(
    documento: string,
    claveActual: string,
    nuevaClave: string
  ): Observable<any> {

    const body = {
      documento,
      claveActual,
      nuevaClave
    };

    return this.http.post(`${this.baseUrl}/cambiar-clave`, body);
  }
}