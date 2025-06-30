import { Component } from '@angular/core';
import { OrdenTrabajoService } from './orden-trabajo.service';
import { OrdenTrabajoDetalle } from './orden-trabajo.model';

@Component({
  selector: 'app-orden-trabajo',
  templateUrl: './orden-trabajo.component.html'
})
export class OrdenTrabajoComponent {
  idOt: string = '';
  detalles: OrdenTrabajoDetalle[] = [];
  error: string = '';
  comentario: string = '';
  busquedaRealizada: boolean = false;


  constructor(private ordenTrabajoService: OrdenTrabajoService) { }

  buscar() {
    this.busquedaRealizada = true;
  
    this.ordenTrabajoService.obtenerDetallePorId(this.idOt).subscribe({
      next: data => {
        this.detalles = data;
        this.error = '';
        if (data.length > 0) {
          this.comentario = data[0].comentario;
        }
      },
      error: err => {
        this.detalles = [];
        this.error = 'No se encontró la OT o hubo un error.';
      }
    });
  }

  guardarComentario() {
    const idOt = this.detalles[0]?.idOt;
    if (!idOt || !this.comentario) {
      alert('Falta el comentario o el ID de la orden.');
      return;
    }
  
    this.ordenTrabajoService.actualizarComentario(idOt, this.comentario).subscribe(
      res => {
        alert('Comentario guardado correctamente.');
        //this.buscar(); // Recarga los datos para ver el comentario actualizado
      },
      err => {
        console.error(err);
        alert('Error al guardar el comentario.');
      }
    );
  }
}