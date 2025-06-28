import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { ProductoNuevo } from './producto-nuevo';


@Injectable({
    providedIn: 'root'
  })
  export class ProductoNuevoService {
  
    private urlEndpoint: string = 'http://localhost:8080/producto';
  
    constructor(private http: HttpClient /*,private router: Router, private authService: AuthService*/) { }
  
    //private httpHeaders =  new HttpHeaders({'Content-Type':'application/json'})
  
    /*private agregarAutorizationHeader(){
      let token = this.authService.token;
      if(token!=null){
        return this.httpHeaders.append('Authorization','Bearer ' + token);
      }
      return this.httpHeaders;
    }*/


      obtenerProductos():Observable<ProductoNuevo[]>{
        return this.http.get<ProductoNuevo[]>(`${this.urlEndpoint}/listar`/*, {headers: this.agregarAutorizationHeader()}*/).pipe(
          catchError(e=>{
            //this.isNoAutorizado(e);
            return throwError(e);
          })
        );
      }

      eliminarProducto(id : string): Observable<ProductoNuevo>{
        return this.http.delete<ProductoNuevo>(`${this.urlEndpoint}/eliminar/${id}`).pipe(
          catchError(e => {
            console.error(e.error.mensaje);
    
            Swal.fire('Error al eliminar el Producto',e.error.mensaje,'error');
            return throwError(e);
          })
        );
      }

  }