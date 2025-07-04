import { Component } from '@angular/core';
import { OrdenTrabajoService } from './orden-trabajo.service';
import { OrdenTrabajoDetalle } from './orden-trabajo.model';
import  Swal from 'sweetalert2';
declare var $: any;

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
  editable: boolean = false;
  modoEdicion: boolean = false;


  constructor(private ordenTrabajoService: OrdenTrabajoService) { }

  ngOnInit(): void {
    //Cargar última búsqueda si existe
    if (this.ordenTrabajoService.ultimoIdOt) {
      this.idOt = this.ordenTrabajoService.ultimoIdOt;
      this.detalles = this.ordenTrabajoService.ultimosDetalles;
      this.comentario = this.ordenTrabajoService.ultimoComentario;
    }
  }
  editarComentario() {
    this.modoEdicion = true;
  }

  buscar() {
    this.ordenTrabajoService.obtenerDetallePorId(this.idOt).subscribe({
      next: data => {
        this.detalles = []; // Limpiamos la tabla primero
        this.destroyDataTable(); //Destruimos la tabla anterior si existe
  
        this.detalles = data;
        this.comentario = data[0]?.comentario || '';
        this.error = '';
  
        setTimeout(() => {
          this.initDataTable(); //Inicializamos la tabla
        }, 100);
      },
      error: err => {
        this.detalles = [];
        this.error = 'No se encontró la OT o hubo un error.';
        this.destroyDataTable(); // 🧹 Destruimos también para evitar residuos
      }
    });
  }

  initDataTable() {
    if ($('#OT').length) {
      $('#OT').DataTable({
        responsive: false,
        lengthChange: false,
        autoWidth: false,
        destroy: true,
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print', 'colvis']
      }).buttons().container().appendTo('#OT_wrapper .col-md-6:eq(0)');
    }
  }
  
  destroyDataTable() {
    if ($.fn.DataTable.isDataTable('#OT')) {
      $('#OT').DataTable().clear().destroy();
    }
  }

  guardarComentario() {
    this.ordenTrabajoService.actualizarComentario(this.idOt, this.comentario).subscribe({
      next: () => {
        Swal.fire('Comentario guardado', '', 'success');
        this.ordenTrabajoService.ultimoComentario = this.comentario;
        this.modoEdicion = false;
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar el comentario', 'error');
      }
    });
  }
  createDataTable() {
    $(function () {
      if ($.fn.dataTable.isDataTable('#OT')) {
        $('#OT').DataTable().clear().destroy();
      }
  
      $("#OT").DataTable({
        "responsive": false,
        "lengthChange": false,
        "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
      }).buttons().container().appendTo('#OT_wrapper .col-md-6:eq(0)');
    });
  }

}