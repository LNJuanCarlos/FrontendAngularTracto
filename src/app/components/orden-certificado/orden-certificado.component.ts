import { Component, OnInit } from '@angular/core';
import { OrdenCertificado } from './orden-certificado.model';
import { OrdenCertificadoService } from './orden-certificado.service';

@Component({
  selector: 'app-orden-certificado',
  templateUrl: './orden-certificado.component.html'
})
export class OrdenCertificadoComponent implements OnInit {

  compania: string = '';
  numeroDoc: number = 1;
  certificados: OrdenCertificado[] = [];
  error: string = '';

  constructor(private certificadoService: OrdenCertificadoService) {}

  ngOnInit(): void {}

  buscar() {
    this.certificadoService.obtenerCertificado(this.compania, this.numeroDoc).subscribe({
      next: data => {
        this.certificados = data;
        this.error = '';
      },
      error: err => {
        this.certificados = [];
        this.error = 'No se encontró el certificado.';
      }
    });
  }
}
