import { Component, OnInit } from '@angular/core';
declare var $: any;
import Swal from 'sweetalert2';
import { ModalService } from '../modal.service';
import { ProductoNuevo } from './producto-nuevo';
import { ProductoNuevoService } from './producto-nuevo.service';


@Component({
  selector: 'app-producto-nuevo',
  templateUrl: './producto-nuevo.component.html',
  styleUrls: []
})
export class ProductoNuevoComponent implements OnInit {

  productos: ProductoNuevo[];

  rootNode: any;

  productoSeleccionado: ProductoNuevo;


  constructor(private productosService: ProductoNuevoService, public modalService: ModalService) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productosService.obtenerProductos().subscribe((producto) => {
      this.productos = producto
      this.createDataTable();
    });
  }

  delete(producto: ProductoNuevo): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Estás Seguro?',
      text: `Está seguro que desea eliminar el Producto ${producto.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.productosService.eliminarProducto(producto.id).subscribe(
          response => {
            this.productos = this.productos.filter(prod => prod !== producto)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              'El Producto ha sido eliminado',
              'success'
            )
          }
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Se ha cancelado la operación',
          'error'
        )
      }
    })
  }

  createDataTable() {

    $(function () {
      $("#productos").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
      }).buttons().container().appendTo('#productos_wrapper .col-md-6:eq(0)');
    });

  }

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA SELECCIONADA Y CAMBIA EL ESTADO DEL MODAL
  abrirModal(producto: ProductoNuevo) {
    this.productoSeleccionado = producto;
    this.modalService.abrirModal();
  }

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA COMO NUEVO PARA LA CREACION DE PERSONA Y CAMBIA EL ESTADO DEL MODAL
  abrirModalNuevo() {
    this.productoSeleccionado = new ProductoNuevo();
    this.modalService.abrirModal();
  }

  deleteTable() {
    $('#productos').dataTable().fnDestroy();
  }

}
