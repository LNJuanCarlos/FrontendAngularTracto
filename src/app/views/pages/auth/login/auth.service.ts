import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _token: string | null = null;

  private url = 'http://localhost:8080/api/auth/login';

  constructor(private http: HttpClient) {}

  /* ================= USUARIO ================= */

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  /* ================= TOKEN ================= */

  public get token(): string | null {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  public set token(value: string | null) {
    this._token = value;
    if (value) {
      sessionStorage.setItem('token', value);
    } else {
      sessionStorage.removeItem('token');
    }
  }

  /* ================= LOGIN ================= */

  login(usuario: Usuario): Observable<any> {
    return this.http.post<any>(this.url, {
      usuario: usuario.username,
      password: usuario.password
    });
  }

  guardarUsuario(documento: string, persona: number, token: string): void {
  this._usuario = new Usuario();
  this._usuario.username = documento; // DOCUMENTO
  this._usuario.persona = persona;    // ID PERSONA

  this.token = token;
  sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  localStorage.setItem('isLoggedin', 'true');
}

  /* ================= AUTH ================= */

  isAuthenticated(): boolean {
    return localStorage.getItem('isLoggedin') === 'true' && this.token != null;
  }

  logout(): void {
    this._usuario = null;
    this._token = null;
    sessionStorage.clear();
    localStorage.clear();
  }

  cambiarPassword(claveActual: string, nuevaClave: string): Observable<any> {
  const url = 'http://localhost:8080/api/auth/cambiar-clave';

  return this.http.post(url, {
    documento: this.usuario.username, //  DOCUMENTO REAL
    claveActual: claveActual,
    nuevaClave: nuevaClave
  });
}
}